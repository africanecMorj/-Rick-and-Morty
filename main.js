let currentPage = 1;
let pageCount = 42;
let idArr1 = JSON.parse(localStorage.getItem(`episodeDb`)) || [];
getPage(currentPage);
let pickleRick = new Audio(`./I_m-Pickle-Rick-Sound-Clip.mp3`)

$('#next').click(() => {
    if(pageCount <= 1){
        pageCount = 2;
    }    
    if (currentPage < pageCount) {
        currentPage++;
        getPage(currentPage);
        $('#currentPage1').text(currentPage);
    }

});


$('#prev').click(() => {
    if (currentPage > 1) {
        currentPage--;
        getPage(currentPage);
        $('#currentPage1').text(currentPage);
    }
});

$(`#filter`).on(`input`,() => {
    let parameters = $(`#parameters`).val();
    let inpVal = $(`#filter`).val();
    axios.get(`https://rickandmortyapi.com/api/character/?page=${currentPage}&${parameters}=${inpVal}`)
        .then(res => {
            let data = res.data;
            let allCharacters = res.data.results;
            pageCount = res.data.info.pages;
            $('.characterContainer').empty();
            for (let el of res.data.results) {
                $('.characterContainer').append(`<div class="characterItem">
                
                <img src="${el.image}" alt="${el.name}">
                <h3>${el.name}</h3>
                <p>${el.species}</p>

                <button class="btn" id="view${el.id}">View</button>
                </div>`);
            }
        })
         .catch(function (error) {
            axios.get(`https://rickandmortyapi.com/api/character/?${parameters}=${inpVal}`)
                .then(res => {
                    let data = res.data;
                    pageCount = res.data.info.pages;
                    currentPage = pageCount;
                    $('#currentPage1').text(currentPage);
                    axios.get(`https://rickandmortyapi.com/api/character/?page=${currentPage}&${parameters}=${inpVal}`)
                        .then(res => {
                            let data = res.data;
                            let allCharacters = res.data.results;
                            pageCount = res.data.info.pages;
                            $('.characterContainer').empty();
                            for (let el of res.data.results) {
                            $('.characterContainer').append(`<div class="characterItem">
                
                            <img src="${el.image}" alt="${el.name}">
                            <h3>${el.name}</h3>
                            <p>${el.species}</p>

                            <button class="btn" id="view${el.id}">View</button>
                </div>`);
            }
        })
                    
                }
            )
        }
    );

        
                
            } 
         )
            


$('.wrap').click((e) => {
    if(e.target.id.substring(0,4) == `view`){
    $(`.wrap`).css(`filter`, `blur(4px)`);    
    $(`.popup2`).css(`display`, `flex`);
    let id = e.target.id.substring(4,8);

    axios.get(`https://rickandmortyapi.com/api/character/${id}`)
        .then(res => {
            let data = res.data;


            $('.popup2').empty();
            $('.popup2').append(`
                <i class="fa-solid fa-xmark" id="popupClose"></i>
                <div class="popupItem">
                <div class="miniPop">
                    <img src="${data.image}" alt="${data.name}">
                    </div>
                    
                    <div class="miniPop">
                    <h3><i class="fa-solid fa-user"></i>${data.name}</h3>
                    <p><i class="fa-brands fa-sourcetree"></i>${data.species}</p>
                    <p><i class="fa-solid fa-heart"></i>${data.status}</p>
                    <p><i class="fa-solid fa-genderless"></i>${data.gender}</p>

                    </div>
                    </div>
                </div>`)

        })

    }else if(e.target.id.substring(0,3) == `add`){
        $(`.wrap`).css(`filter`, `blur(4px)`);
        $(`.popup2`).css(`display`, `flex`);
        let b = false;
        let id = e.target.id.substring(0,6);
        let id2 = e.target.id.substring(3,6);
        let a = JSON.parse(localStorage.getItem(`episodeDb`)) || [];
        for(let el of a){
            if(id2 == el){
                b = true;
            }
        };

        if(b == false){
            idArr1.push(id2);
            
        }
        localStorage.setItem(`episodeDb`, JSON.stringify(idArr1));
        let episodeId = JSON.parse(localStorage.getItem(`episodeDb`)) || [];
        $(`.popup2`).empty();
        $(`.popup2`).append(
            `<i class="fa-solid fa-xmark" id="popupClose"></i>`)
        for(i=0; i<episodeId.length; i++){
        axios.get(`https://rickandmortyapi.com/api/episode/${episodeId[i]}`)
        .then(res => {
            $(`.popup2`).append( 
                `
                <div class="item">
                    <p class="namP">${res.data.name}</p>
                    <div class="btnDelete"><i id="${`btnDelete`+res.data.id} "class="fa-solid fa-trash-can"></i></div>
                </div>`);
        })  
    }     
    
    }

});

document.getElementById(`popup2`).onclick =  function(e)  {
    if(e.target.id.substring(0,9) == `btnDelete`){
        let idArr = [];
        let ID = e.target.id.substring(9,12);
        let episodeId = JSON.parse(localStorage.getItem(`episodeDb`)) || [];
        for(el of episodeId){
            if(parseInt(ID) == parseInt(el)){
                
            
            }else if(parseInt(ID) != parseInt(el)){
                idArr.push(el);
            }
            idArr1 = idArr;
        };

        localStorage.setItem(`episodeDb`, JSON.stringify(idArr1));
        $(`.popup2`).empty();
        $(`.popup2`).append(
            `<i class="fa-solid fa-xmark" id="popupClose"></i>`
        )
        for(i=0; i<idArr.length; i++){
            axios.get(`https://rickandmortyapi.com/api/episode/${idArr[i]}`)
            .then(res => {
                $(`.popup2`).append( 
                    `
                    <div class="item">
                        <p class="namP">${res.data.name}</p>
                        <div class="btnDelete"><i id="${`btnDelete`+res.data.id} "class="fa-solid fa-trash-can"></i></div>
                    </div>`);
            })  
    }
}else if(e.target.id == `popupClose`){
    $(`#popup2`).css(`display`, `none`);
    $(`.wrap`).css(`filter`, `blur(0px)`);
}
}

function getPage(page) {
    if($(`#filter`).val() == ``){
    axios.get(`https://rickandmortyapi.com/api/character/?page=${page}`)
        .then(res => {
            let allCharacters = res.data.results;
            pageCount = res.data.info.pages;

            $('.characterContainer').empty();
            for (let el of res.data.results) {
                $('.characterContainer').append(`<div class="characterItem">
                
                <img src="${el.image}" alt="${el.name}">
                <h3>${el.name}</h3>
                <p>${el.species}</p>

                <button class="btn" id="view${el.id}">View</button>
                </div>`);
            }
        })
    
    }else if($(`#filter`).val() != ``){
        let parameters = $(`#parameters`).val();
        let inpVal = $(`#filter`).val();
        axios.get(`https://rickandmortyapi.com/api/character/?page=${page}&${parameters}=${inpVal}`)
        .then(res => {
            let allCharacters = res.data.results;
            pageCount = res.data.info.pages;
            $('.characterContainer').empty();
            for (let el of res.data.results) {
                $('.characterContainer').append(`<div class="characterItem">
                
                <img src="${el.image}" alt="${el.name}">
                <h3>${el.name}</h3>
                <p>${el.species}</p>

                <button class="btn" id="view${el.id}">View</button>
                </div>`);
            }
        })
    }
}

let pageCount2 = 3;
let currentPage2 = 1;

getPage2(currentPage2);


$('#next2').click(() => {
    if(pageCount2 <= 1){
        pageCount2 = 2;
    }    
    if (currentPage2 < pageCount2) {
        currentPage2++;
        getPage2(currentPage2);
        $('#currentPage2').text(currentPage2);
        
    }

});


$('#prev2').click(() => {
    if (currentPage2 > 1) {
        currentPage2--;
        getPage2(currentPage2);
        $('#currentPage2').text(currentPage2);
    }
});

$(`#filter2`).on(`input`,() => {
    let parameters = $(`#parameters2`).val();
    let inpVal = $(`#filter2`).val();
    
    axios.get(`https://rickandmortyapi.com/api/episode/?page=${currentPage2}&${parameters}=${inpVal}`)
        .then(res => {
            let data = res.data;
            let allEpisodes = res.data.results;
            pageCount2 = res.data.info.pages;
            $('#currentPage2').text(res.data.info.pages);
            $('.episodesContainer').empty();
            for (let el of res.data.results) {
                $('.episodesContainer').append(`
                    <div class="characterItem">
                    <h3>${el.name}</h3>
                    <p>${el.episode}</p>
                    <button class="btn" id="add${el.id}">Add</button>
                </div>
                    `);
            }
        })
         .catch(function (error) {
            axios.get(`https://rickandmortyapi.com/api/episode/?${parameters}=${inpVal}`)
                .then(res => {
                    let data = res.data;
                    pageCount2 = res.data.info.pages;
                    currentPage2 = pageCount2;
                    $('#currentPage2').text(currentPage2);
                    axios.get(`https://rickandmortyapi.com/api/episode/?page=${currentPage2}&${parameters}=${inpVal}`)
                        .then(res => {
                            let data = res.data;
                            let allCharacters = res.data.results;
                            pageCount2 = res.data.info.pages;
                            $('.episodesContainer').empty();
                            for (let el of res.data.results) {
                            $('.episodesContainer').append(`<div class="characterItem">
                                <h3>${el.name}</h3>
                                <p>${el.episode}</p>
                                <button class="btn" id="add${el.id}">Add</button>
                                
                </div>`);
            }
        })
                    
                }
            )
        }
    );

        
                
            } 
         )
            
function getPage2(page) {
    if($(`#filter2`).val() == ``){
    axios.get(`https://rickandmortyapi.com/api/episode/?page=${page}`)
        .then(res => {
            let allEpisodes = res.data.results;
            pageCount2 = res.data.info.pages;
            $('.episodesContainer').empty();
            for (let el of res.data.results) {
                $('.episodesContainer').append(`<div class="characterItem">
                <h3>${el.name}</h3>
                <p>${el.episode}</p>
                <button class="btn" id="add${el.id}">Add</button>
                </div>`);
            }
        })
    }else if($(`#filter2`).val() != ``){
        let parameters = $(`#parameters2`).val();
        let inpVal = $(`#filter2`).val();
        axios.get(`https://rickandmortyapi.com/api/episode/?page=${page}&${parameters}=${inpVal}`)
        .then(res => {
            let allEpisodes = res.data.results;
            pageCount2 = res.data.info.pages;
            $('.episodesContainer').empty();
            for (let el of res.data.results) {
                $('.episodesContainer').append(`<div class="characterItem">
                <h3>${el.name}</h3>
                <p>${el.episode}</p>
                <button class="btn" id="add${el.id}">Add</button>
                </div>`);
            }
        })
    }    
}

$(`.episodesList`).click(() => {
    $(`.wrap`).css(`filter`, `blur(4px)`);
    $(`.popup2`).css(`display`, `flex`);
    $(`.popup2`).empty();
    $(`.popup2`).append(
            `<i class="fa-solid fa-xmark" id="popupClose"></i>`)
    let episodeId = JSON.parse(localStorage.getItem(`episodeDb`)) || [];
    for(i=0; i<episodeId.length; i++){
        axios.get(`https://rickandmortyapi.com/api/episode/${episodeId[i]}`)
        .then(res => {
            $(`.popup2`).append( 
                `
                <div class="item">
                    <p class="namP">${res.data.name}</p>
                    <div class="btnDelete" ><i id="btnDelete${res.data.id} "class="fa-solid fa-trash-can"></i></div>
                </div>`);
        })  
    }
});


let pageCount3 = 7;
let currentPage3 = 1;

getPage3(currentPage3);


$('#next3').click(() => {
    if(pageCount3 <= 1){
        pageCount3 = 2;
    }    
    if (currentPage3 < pageCount3) {
        currentPage3++;
        getPage3(currentPage3);
        $('#currentPage3').text(currentPage3);
    }

});


$('#prev3').click(() => {
    if (currentPage3 > 1) {
        currentPage3--;
        getPage3(currentPage3);
        $('#currentPage3').text(currentPage3);
    }
});

$(`#filter3`).on(`input`,() => {
    let parameters = $(`#parameters3`).val();
    let inpVal = $(`#filter3`).val();
    axios.get(`https://rickandmortyapi.com/api/location/?page=${currentPage3}&${parameters}=${inpVal}`)
        .then(res => {
            let data = res.data;
            let allLocations = res.data.results;
            pageCount3 = res.data.info.pages;
            $('.locationContainer').empty();
            for (let el of res.data.results) {
                $('.locationContainer').append(`
                    <div class="characterItem">
                    <h3>${el.name}</h3>
                    <p>${el.dimension}</p>
                    <p>${el.type}</p>
                </div>
                    `);
            }
        })
         .catch(function (error) {
            axios.get(`https://rickandmortyapi.com/api/location/?${parameters}=${inpVal}`)
                .then(res => {
                    let data = res.data;
                    pageCount3 = res.data.info.pages;
                    currentPage3 = pageCount3;
                    $('#currentPage3').text(res.data.info.pages);
                    axios.get(`https://rickandmortyapi.com/api/location/?page=${currentPage3}&${parameters}=${inpVal}`)
                        .then(res => {
                            let data = res.data;
                            let allCharacters = res.data.results;
                            pageCount3 = res.data.info.pages;
                            $('.locationContainer').empty();
                            for (let el of res.data.results) {
                            $('.locationContainer').append(`<div class="characterItem">
                                <h3>${el.name}</h3>
                                <p>${el.dimension}</p>
                                <p>${el.type}</p>
                                
                </div>`);
            }
        })
                    
                }
            )
        }
    );

        
                
            } 
         )
            
function getPage3(page) {
    if($(`#filter3`).val() == ``){
    axios.get(`https://rickandmortyapi.com/api/location/?page=${page}`)
        .then(res => {
            let allLocations = res.data.results;
            pageCount3 = res.data.info.pages;
            $('.locationContainer').empty();
            for (let el of res.data.results) {
                $('.locationContainer').append(`<div class="characterItem">
                <h3>${el.name}</h3>
                <p>${el.dimension}</p>
                <p>${el.type}</p>
                </div>`);
            }
        })
    
    }else if($(`#filter3`).val() != ``){
        let parameters = $(`#parameters3`).val();
        let inpVal = $(`#filter3`).val();
        axios.get(`https://rickandmortyapi.com/api/location/?page=${page}&${parameters}=${inpVal}`)
        .then(res => {
            let allLocations = res.data.results;
            pageCount3 = res.data.info.pages;
            $('.locationContainer').empty();
            for (let el of res.data.results) {
                $('.locationContainer').append(`<div class="characterItem">
                <h3>${el.name}</h3>
                <p>${el.dimension}</p>
                <p>${el.type}</p>
                </div>`);
            }
        })
            
    }
}

$(`.charPage`).click(function(){
    pickleRick.play();
    $(`.pickle`).css(`display`, `flex`);
    setTimeout(function(){
        $(`#wrapSer`).css(`display`, `none`);
        $(`#wrapLoc`).css(`display`, `none`);
        $(`#wrapChar`).css(`display`, `flex`);
        $(`.curtain`).css(`display`, `flex`);
    },1700);
    setTimeout(function(){
        $(`.pickle`).css(`display`, `none`);
    },2000);
    setTimeout(function(){
        $(`.curtain`).css(`display`, `none`);
    },2200);

});

$(`.locPage`).click(function(){
    pickleRick.play();
    $(`.pickle`).css(`display`, `flex`);
    setTimeout(function(){
        $(`#wrapSer`).css(`display`, `none`);
        $(`#wrapLoc`).css(`display`, `flex`);
        $(`#wrapChar`).css(`display`, `none`);
        $(`.curtain`).css(`display`, `flex`);
    },1700);
    setTimeout(function(){
        $(`.pickle`).css(`display`, `none`);
    },2000);
    setTimeout(function(){
        $(`.curtain`).css(`display`, `none`);
    },2200);

});

$(`.episodePage`).click(function(){
    pickleRick.play();
    $(`.pickle`).css(`display`, `flex`);
    setTimeout(function(){
        $(`#wrapSer`).css(`display`, `flex`);
        $(`#wrapLoc`).css(`display`, `none`);
        $(`#wrapChar`).css(`display`, `none`);
        $(`.curtain`).css(`display`, `flex`);
    },1700);
    setTimeout(function(){
        $(`.pickle`).css(`display`, `none`);
    },2000);
    setTimeout(function(){
        $(`.curtain`).css(`display`, `none`);
    },2200);
});

