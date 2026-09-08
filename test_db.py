from app.db.session import engine

try:
    conn = engine.connect()
    print("✅ DB Connected")
    conn.close()
except Exception as e:
    print("❌ Error:", e)
