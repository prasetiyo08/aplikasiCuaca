const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')

const app = express()

//Mendefinisikan jalur/path untuk konfigurasi Express
const direktoriPublic = path.join(__dirname, '../public')
const direktoriViews = path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname, '../templates/partials')


//Setup handlebars engine dan lokasi folder views
app.set('view engine', 'hbs')
app.set('views', direktoriViews)
hbs.registerPartials(direktoriPartials)

// Setup direktori statis
app.use(express.static(direktoriPublic))

//ini halaman / page utama
app.get('', (req, res) => {
    res.render('index', {
        judul: 'Aplikasi Cek Cuaca',
        nama: 'Muhammad Auliya Dimas Prasetiyo'
    })
})

//ini halaman bantuan/FAQ (Frequently Asked Question)
app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
        judul: 'Bantuan',
        nama: 'Muhammad Auliya Dimas Prasetiyo',
        teksBantuan: 'ini adalah teks bantuan'
    })
})

//ini halaman info cuaca/FAQ (Frequently Asked Question)
app.get('/infoCuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: ' Kamu harus memasukan lokasi yang ingin dicari'
        })
    }
    geocode(req.query.address, (error, {
        latitude,
        longitude,
        location
    } = {}) => {
        if (error) {
            return res.send({
                error
            })
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error) {
                return res.send({error})
            }
            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            })
        })
    })
})

//ini halaman tentang/FAQ (Frequently Asked Question)
app.get('/tentang', (req, res) => {
    res.render('tentang', {
        judul: 'Tentang Saya',
        nama: 'Muhammad Auliya Dimas Prasetiyo'
    })
})

app.get('/bantuan/*', (req, res) => {
    res.render('404', {
        judul: '404',
        nama: 'Muhammad Auliya Dimas Prasetiyo',
        pesanKesalahan: 'Artikel yang dicari tidak ditemukan'
    })
})


app.get('*', (req, res) => {
    res.render('404', {
        judul: '404',
        nama: 'Muhammad Auliya Dimas Prasetiyo',
        pesanKesalahan: 'Halaman tidak ditemukan.'
    })
})


app.listen(4000, () => {
    console.log('Server berjalan pada port 4000.')
})

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('loader').style.display = 'block';
    
    // Simulasikan pemrosesan
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('pesan-1').textContent = 'Hasil cuaca ditemukan!';
    }, 2000);
});
