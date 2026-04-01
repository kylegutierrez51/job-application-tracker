from flask import Blueprint, render_template, request, current_app, jsonify

contacts_bp = Blueprint("contacts", __name__)

def serialize_contact(contact):
    return {
        **contact,
        'created_at': contact['created_at'].isoformat() if contact['created_at'] is not None else None,
    }


@contacts_bp.route("/", methods=["GET", "POST"])
def index():
    db = current_app.db
    
    if request.method == 'POST':
        # VALIDATION LOGIC
        data = request.get_json()
        db.add_contact(data)
        return jsonify({'success': True})
    
    if request.method == 'GET':
        contacts = [serialize_contact(c) for c in db.get_all_contacts()]
        return render_template("contacts.html", contacts=contacts)



@contacts_bp.route("/<int:contact_id>", methods=["PUT", "DELETE"])
def modify_contact(contact_id):
    db = current_app.db

    if request.method == 'PUT':
        # VALIDATION LOGIC
        data = request.get_json()
        db.edit_contact(data, contact_id)
        print('Edited Contact: ', db.get_contact(contact_id), '\n')
        return jsonify({'success': True})

    if request.method == 'DELETE':
        db.delete_contact(contact_id)
        return jsonify({'success': True})




@contacts_bp.route("/api/count")
def api_contacts_count():
    db = current_app.db
    contacts_count = db.get_contacts_count()
    return jsonify({'count': contacts_count})