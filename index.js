require('dotenv').config()
const axios = require ('axios')

const {
    APPID,
    Q,
    LIMIT,
    URL_BASE
  } = process.env

const url = `${URL_BASE}?q=${Q}&limit=${LIMIT}&appid=${APPID}`


async function obtemCoordenadas() {
    try {
        const res = await axios.get(url)
        
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


obtemCoordenadas()
.then(coordenadas => {
    console.log(`As coordenadas de ${Q}, no estado de ${coordenadas.estado}, em ${coordenadas.pais} são: Latitude ${coordenadas.latitude}, Longitude ${coordenadas.longitude}`);
})
.catch(error => {
     console.error(error.message);
});