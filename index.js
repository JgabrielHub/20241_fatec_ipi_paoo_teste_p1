require('dotenv').config()
const axios = require ('axios')

const {
    APPID,
    Q,
    LIMIT,
    GEO_URL_BASE,
    UNITS,
    IDIOM,
    CW_URL_BASE
  } = process.env

const urlGeo = `${GEO_URL_BASE}?q=${Q}&limit=${LIMIT}&appid=${APPID}`


async function obterCoordenadas() {
    try {
        const res = await axios.get(urlGeo)
        
        if (res.data && res.data.length > 0) {
            const cidade = res.data[0];
            const latitude = cidade.lat;
            const longitude = cidade.lon;
            const estado = cidade.state;
            const pais = cidade.country;
            return {latitude, longitude, estado, pais};
        } else {
            throw new Error("Cidade não encontrada.");
        }
    } catch (error) {
        throw new Error("Erro ao obter coordenadas da cidade:", error.message);
    }
}

async function obterPrevisao() {
    try {
        const {latitude, longitude } = await obterCoordenadas();
        const urlCw = `${CW_URL_BASE}?lat=${latitude}&lon=${longitude}&appid=${APPID}&units=${UNITS}&lang=${IDIOM}`
        const res = await axios.get(urlCw)
        
        if (res.data) {
            const feelsLike = res.data.main.feels_like;
            const description = res.data.weather[0].description;
            return { feelsLike, description };
        } else {
            throw new Error("Erro ao obter condições climáticas atuais.");
        }
    } catch (error) {
        throw new Error("Erro ao obter condições climáticas atuais:", error.message);
    }
}

obterPrevisao()
.then(weather => {
    console.log(`Sensação térmica em ${Q}: ${weather.feelsLike}°C`);
    console.log(`Descrição do clima em ${Q}: ${weather.description}`);
})
.catch(error => {
    console.error(error.message);
});