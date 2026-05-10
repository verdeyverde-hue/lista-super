import streamlit as st

st.title("🛒 Mi Súper Familiar")

if 'lista' not in st.session_state:
    st.session_state.lista = []

item = st.text_input("¿Qué falta comprar?")
col1, col2 = st.columns(2)

with col1:
    if st.button("Agregar a Almacén"):
        if item:
            st.session_state.lista.append(f"📦 {item} (Almacén)")
            st.rerun()

with col2:
    if st.button("Agregar a Verdulería"):
        if item:
            st.session_state.lista.append(f"🥬 {item} (Verdulería)")
            st.rerun()

st.write("### Lista actual:")
for i, producto in enumerate(st.session_state.lista):
    st.write(f"{i+1}. {producto}")

if st.button("Limpiar lista"):
    st.session_state.lista = []
    st.rerun()
