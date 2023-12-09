// tarayıcıların depolama alanları
// localstorage ve sessionstorage, tarayıcının sunduğu iki farklı web depolama alanı.

// localstorage'a veri ekleme

localStorage.setItem("kullaniciAdi", "Okan");

//localstorage'dan veri çekme
const kullaniciAdi = localStorage.getItem("kullaniciAdi");