import json
import uuid
from pathlib import Path

from flask import Flask, abort, jsonify, redirect, render_template_string, request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "products.txt"
UPLOAD_FOLDER = BASE_DIR / "uploads" / "nft-images"
AVATAR_FOLDER = BASE_DIR / "uploads" / "avatars"

# Создаем папки для загрузок, если их нет
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
AVATAR_FOLDER.mkdir(parents=True, exist_ok=True)

# Разрешенные расширения файлов
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS





def load_products():

    if not DATA_PATH.exists():

        raise FileNotFoundError(f"Не найден файл с товарами: {DATA_PATH}")

    with DATA_PATH.open("r", encoding="utf-8") as fp:

        return json.load(fp)





PRODUCTS = load_products()

PRODUCTS_BY_ID = {product["id"]: product for product in PRODUCTS}



app = Flask(__name__, static_folder=str(BASE_DIR), static_url_path="")





def render_product_page(product):

    template = """

    <!DOCTYPE html>

    <html lang="ru">

    <head>

        <meta charset="UTF-8">

        <title>{{ product.fullName }} | NFTopia Galaxy</title>

        <link rel="stylesheet" href="https://cdn.tailwindcss.com">

        <style>

            body { background-color: #0f0e17; color: #fffffe; font-family: 'Inter', sans-serif; }

            .tag { background:#2cb67d; padding:4px 8px; border-radius:6px; font-size:12px; }

            .card { background:#16161a; border-radius:16px; padding:24px; }

            .grid { display:grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap:16px; }

            .prop { background:#242629; padding:12px; border-radius:12px; }

        </style>

    </head>

    <body class="min-h-screen p-6">

        <a href="/" class="text-sm text-[#7f5af0] hover:underline">&larr; На главную NFTopia Galaxy</a>

        <div class="max-w-5xl mx-auto mt-6 card">

            <div class="grid gap-8">

                <div>

                    <img src="{{ product.image }}" alt="{{ product.fullName }}" class="w-full rounded-xl shadow-lg">

                </div>

                <div>

                    <h1 class="text-3xl font-bold mb-2">{{ product.fullName }}</h1>

                    <div class="flex items-center gap-3 mb-4">

                        <span class="tag">{{ product.category }}</span>

                        <span class="text-gray-400">{{ product.collection }}</span>

                    </div>

                    <p class="text-gray-300 mb-4">{{ product.description }}</p>

                    <div class="grid gap-3">

                        <div class="flex justify-between"><span>Текущая цена</span><strong>{{ product.price }} ETH</strong></div>

                        <div class="flex justify-between text-gray-400"><span>Последняя цена</span><span>{{ product.lastPrice }} ETH</span></div>

                        <div class="flex justify-between text-gray-400"><span>Текущая ставка</span><span>{{ product.currentBid }} ETH</span></div>

                        <div class="flex justify-between text-gray-400"><span>Лайки</span><span>{{ product.likes }}</span></div>

                        <div class="flex justify-between text-gray-400"><span>Просмотры</span><span>{{ product.views }}</span></div>

                    </div>

                </div>

            </div>

            <div class="mt-8">

                <h2 class="text-xl font-semibold mb-3">Свойства</h2>

                <div class="grid">

                    {% for prop in product.properties %}

                    <div class="prop">

                        <div class="text-gray-400 text-sm">{{ prop.trait }}</div>

                        <div class="font-medium">{{ prop.value }}</div>

                    </div>

                    {% endfor %}

                </div>

            </div>

            <div class="mt-8">

                <h2 class="text-xl font-semibold mb-3">История</h2>

                <div class="space-y-3">

                    {% for event in product.history %}

                    <div class="flex justify-between border-b border-gray-800 pb-2">

                        <div>

                            <div class="font-medium">{{ event.event }}</div>

                            <div class="text-sm text-gray-400">{{ event.date }}</div>

                        </div>

                        <div class="text-[#7f5af0] font-semibold">

                            {% if event.price is not none %}{{ event.price }} ETH{% else %}—{% endif %}

                        </div>

                    </div>

                    {% endfor %}

                </div>

            </div>

        </div>

    </body>

    </html>

    """

    return render_template_string(template, product=product)





@app.route("/")

def home():

    return send_from_directory(app.static_folder, "index.html")





@app.route("/api/products")

def api_products():

    """API endpoint для получения всех продуктов"""

    return jsonify(PRODUCTS)





@app.route("/api/products/<product_id>")

def api_product_detail(product_id: str):

    """API endpoint для получения одного продукта по ID"""

    product = PRODUCTS_BY_ID.get(product_id)

    if not product:

        return jsonify({"error": "Product not found"}), 404

    return jsonify(product)





@app.route("/products/<product_id>")

def product_detail(product_id: str):

    product = PRODUCTS_BY_ID.get(product_id)

    if not product:

        abort(404)

    return render_product_page(product)





@app.route("/<page_name>.html")

def legacy_html_redirect(page_name: str):

    # Сохраняем query параметры при редиректе

    query_string = request.query_string.decode('utf-8')

    redirect_url = f"/{page_name}"

    if query_string:

        redirect_url += f"?{query_string}"

    return redirect(redirect_url, code=301)





@app.route("/<page_name>")

def html_page(page_name: str):

    # if "." in page_name:

    #     return static_files(page_name)



    candidate = BASE_DIR / f"{page_name}.html"

    if candidate.exists():

        return send_from_directory(app.static_folder, f"{page_name}.html")

    abort(404)





@app.route("/<path:path>")
def static_files(path):
    file_path = Path(app.static_folder) / path
    if file_path.exists() and file_path.is_file():
        return send_from_directory(app.static_folder, path)
    abort(404)

@app.route("/api/upload-image", methods=["POST"])
def upload_image():
    """API endpoint для загрузки изображений NFT"""
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed. Allowed types: PNG, JPG, JPEG, GIF, WebP"}), 400
    
    # Генерируем уникальное имя файла
    file_ext = file.filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = UPLOAD_FOLDER / unique_filename
    
    # Сохраняем файл
    try:
        file.save(str(file_path))
        # Возвращаем URL для доступа к изображению
        image_url = f"/uploads/nft-images/{unique_filename}"
        return jsonify({"success": True, "imageUrl": image_url}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to save file: {str(e)}"}), 500

@app.route("/api/upload-avatar", methods=["POST"])
def upload_avatar():
    """API endpoint для загрузки аватаров пользователей"""
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed. Allowed types: PNG, JPG, JPEG, GIF, WebP"}), 400
    
    # Генерируем уникальное имя файла
    file_ext = file.filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = AVATAR_FOLDER / unique_filename
    
    # Сохраняем файл
    try:
        file.save(str(file_path))
        # Возвращаем URL для доступа к изображению
        avatar_url = f"/uploads/avatars/{unique_filename}"
        return jsonify({"success": True, "avatarUrl": avatar_url}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to save file: {str(e)}"}), 500

@app.route("/uploads/nft-images/<filename>")
def serve_uploaded_image(filename):
    """Раздача загруженных изображений NFT"""
    file_path = UPLOAD_FOLDER / filename
    if file_path.exists() and file_path.is_file():
        return send_from_directory(str(UPLOAD_FOLDER), filename)
    abort(404)

@app.route("/uploads/avatars/<filename>")
def serve_avatar(filename):
    """Раздача загруженных аватаров"""
    file_path = AVATAR_FOLDER / filename
    if file_path.exists() and file_path.is_file():
        return send_from_directory(str(AVATAR_FOLDER), filename)
    abort(404)





if __name__ == "__main__":

    app.run(debug=True,port=8080, host="127.0.0.1")



