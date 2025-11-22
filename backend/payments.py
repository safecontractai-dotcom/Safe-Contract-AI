from flask import Blueprint, request, jsonify
import razorpay

payment_bp = Blueprint("payment", __name__)

client = razorpay.Client(auth=("YOUR_KEY_ID", "YOUR_SECRET"))

@payment_bp.route("/create-order", methods=["POST"])
def create_order():
    data = request.json
    amount = int(data["amount"]) * 100  # Razorpay accepts paise

    order = client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": 1
    })

    return jsonify(order)
