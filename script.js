window.onload = function() {
    var data = window.localStorage.getItem("data")
    JSON.parse(data).articles.reverse().forEach(article => {
        createArticle(article)
    });
    [...document.getElementsByClassName('saveButton')].forEach(b => {
        b.addEventListener("click", saveData)
    })

}

function saveData() {
    var cn = [...document.getElementById("article-container").childNodes];

    var innerContent = cn.filter(node => {
        return node.id != "articleTemplate" && node.nodeName == "DIV";
    }).map(node => {

        return {
            baseParagraph: node.querySelector('p[name="plainParagraph"]').innerHTML.trim(),
            dateCreated: node.querySelector('time').innerHTML.trim(),

            sentanceSummaries: [...node.querySelector('div[class="noteHolder"]').querySelectorAll('input')].map(sn => {
                return sn.value;
            }),

            textAreaContent: node.querySelector('textarea').value
        }
    });

    var data = JSON.stringify({ articles: innerContent });

    localStorage.setItem("data", data);
}

document.getElementById('addArticle').addEventListener("click", () => {
    createArticle()
})

function createArticle(aData) {
    var original = document.getElementById("articleTemplate");
    var clone = original.cloneNode(true);
    clone.id = ""

    var count = 0;
    var p1 = clone.querySelector('p[name="plainParagraph"]');
    var p2 = clone.querySelector('p[name="buttonParagraph"]');
    var date = clone.querySelector('time');
    var noteHolder = clone.querySelector('div[name="noteHolder"]');
    var textArea = clone.querySelector('textarea');

    if (aData) {
        p1.innerHTML += aData.baseParagraph;
        date.innerHTML = aData.dateCreated;
        textArea.value = aData.textAreaContent;

    } else {
        const d = new Date();
        date.innerHTML = d.getMonth() + "-" + d.getDate() + "-" + d.getFullYear();
        p1.innerHTML += articles[Math.floor(Math.random() * 2)]

    }
    p1.innerHTML.split(/(?<=[.?!])/).forEach(sentance => {
        var deliminators = [",", ".", "?", "!", ";", "-"]
        sentance.split(" ").forEach(word => {
            if (word != " " && word != "" && word != "\n") {
                var addOn = ""
                deliminators.forEach(del => {
                    if (word.includes(del)) {
                        word = word.replace(del, "")
                        addOn = del
                    }
                })

                var button = document.createElement("button")
                button.innerHTML = word + addOn
                button.name = "sentance" + count
                button.addEventListener("click", () => {
                    noteHolder.querySelector("input[name=" + button.name + "]").value += word + " ";
                    saveData();
                });
                p2.appendChild(button)
            }
        })

        if (/\S/.test(sentance)) {
            var newInput = document.createElement("input")
            newInput.type = "text"
            newInput.name = "sentance" + count
            if (aData) {
                newInput.value = aData.sentanceSummaries[count]
            }
            noteHolder.appendChild(newInput)
        }
        count++
    })
    document.getElementById("article-container").prepend(clone);
    saveData()
}

articles = [
    "The Kyrgyz Revolution of 2010, also known as the Second Kyrgyz Revolution, the Melon Revolution, the April Events or officially as the People's April Revolution, began in April 2010 with the ousting of Kyrgyz president Kurmanbek Bakiyev in the capital Bishkek. It was followed by increased ethnic tension involving Kyrgyz people and Uzbeks in the south of the country, which escalated in June 2010. The violence ultimately led to the consolidation of a new parliamentary system in Kyrgyzstan.",

    "Lake Titicaca is a large, deep, freshwater lake in the Andes on the border of Bolivia and Peru, often called the 'highest navigable lake' in the world. By volume of water and by surface area, it is the largest lake in South America. Lake Titicaca has a surface elevation of 3,812 m (12,507 ft). The 'highest navigable lake' claim is generally considered to refer to commercial craft."
]