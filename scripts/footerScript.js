//___________________________________________________________________Skrevet af Pavia_______________________________________________________________

function fetchData()
{
    fetch('scripts/footerItems.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("Http error " + response.status)
        }
        return response.json();
    })
    .then(data => createListItems(data))
    .catch(error => console.error("failed to fetch data", error))
}
fetchData();

const Footer_data = document.getElementById("footerBox1");
function createFooter(footerBox1){
    return `        
    
        <p class="listP">${footerBox1.description}</p>
        
    `;
}
const Footer_data2 = document.getElementById("footerBox2");
function createFooter2(footerBox2){
    return `      
        <p class="listP">${footerBox2.description}</p>
    `;
}
const Footer_data3 = document.getElementById("footerBox3");
function createFooter3(footerBox3)
{
    return `<p class="listP">${footerBox3.description}</p>`;
}


function createListItems(data)
{
    console.log("wtf!?")
    for (let i = 0; i< data.footerBox1.length; i++)
    {
        Footer_data.innerHTML += createFooter(data.footerBox1[i])
    }

    for (let i = 0; i< data.footerBox2.length; i++)
    {
        Footer_data2.innerHTML += createFooter2(data.footerBox2[i])
    }

    for (let i = 0; i< data.footerBox3.length; i++)
    {
        Footer_data3.innerHTML += createFooter3(data.footerBox3[i])
    }
}
