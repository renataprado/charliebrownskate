const axios = require('axios');
const cheerio = require('cheerio');

main()

async function main(){
    let songs = await getSongs();

    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        song.letra = await getLetra(song.link);
        if(song.letra.includes("skate")){
            song.hasSkate = true;
            song.skates = countSkate(song.letra);
        }
    }

    let totalSkates = 0;
    songs.forEach(song => {
        if(song.hasSkate){
            console.log(song.nome + " - skates: " + song.skates)
            totalSkates = totalSkates + song.skates
        }
    });

    console.log("totalSkates ="+ totalSkates)

}

function countSkate(letra) {
    let count = 0
    let words = letra.split(" ");
    for (let i = 0; i <= words.length; i++) {
        let word = words[i]+""
        if (word.includes("skate")) {
            console.log("skate")
            count=count+1;
        }
    }
    return count;
}

async function getSongs(){
    try{
        const html = await axios('https://www.letras.mus.br/charlie-brown-jr/')
        const $ = cheerio.load(html.data);
        const as = $('.song-name');
        let musicas = [];
        as.each( (i, element) => {
            const link = $(element).attr('href')
            const nome = $(element).text();
            musicas.push({
                link: 'https://www.letras.mus.br'+link,
                nome,
                letra: "",
                hasSkate: false,
                skates: 0
             })
        });
        return musicas;
    }
    catch(e){
        console.log(e);
    }

}

async function getLetra(url) {
    try{
        const html = await axios(url)
        const $ = cheerio.load(html.data);
        const ps = $('.cnt-letra').find('p')
        letra = "";
        ps.each((i, element) => {
            let text = $(element).slice() + "";
            letra = letra + text
        })
        let replacetag = letra.replace(/<p>|<\/p>|<br>/g, " ")
        return replacetag.toLowerCase()
    }
    catch(e){
        console.log(e);
    }
    
}