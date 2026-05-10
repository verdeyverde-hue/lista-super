import streamlit as st

st.title("🛒 Lista Súper Familiar")

if 'lista' not in st.session_state:
    st.session_state.lista = []

item = st.text_input("¿Qué falta comprar?")
col1, col2 = st.columns(2)

with col1:
    if st.button("🏠 Almacén"):
        if item:
            st.session_state.lista.append(f"📦 {item} (Almacén)")
            st.rerun()

with col2:
    if st.button("🥬 Verdulería"):
        if item:
            st.session_state.lista.append(f"🌿 {item} (Verdulería)")
            st.rerun()

st.write("---")
for i, p in enumerate(st.session_state.lista):
    st.write(f"{i+1}. {p}")

if st.button("Limpiar lista"):
    st.session_state.lista = []
    st.rerun()
