FROM mysql:8.0
# Hapus ENV root password di sini agar tidak membingungkan
# Hapus COPY init script jika sudah didefinisikan di compose (atau biarkan jika ingin default)
CMD ["--default-authentication-plugin=mysql_native_password"]
