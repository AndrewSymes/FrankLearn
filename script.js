const token = "0fbc95d44992447eaf2a2db25b1d77cc"

const deliminators = [",", ".", "?", "!", ";", "-", "'", '"', ")", "("]

const articles = {
    "The Kyrgyz revolution": "The Kyrgyz Revolution of 2010, also known as the Second Kyrgyz Revolution, the Melon Revolution, the April Events or officially as the People's April Revolution, began in April 2010 with the ousting of Kyrgyz president Kurmanbek Bakiyev in the capital Bishkek. It was followed by increased ethnic tension involving Kyrgyz people and Uzbeks in the south of the country, which escalated in June 2010. The violence ultimately led to the consolidation of a new parliamentary system in Kyrgyzstan.",

    "Lake Titica": "Lake Titicaca is a large, deep, freshwater lake in the Andes on the border of Bolivia and Peru, often called the 'highest navigable lake' in the world. By volume of water and by surface area, it is the largest lake in South America. Lake Titicaca has a surface elevation of 3,812 m (12,507 ft). The 'highest navigable lake' claim is generally considered to refer to commercial craft.",

}

window.onload = function() {
    var data = window.localStorage.getItem("data")
    JSON.parse(data).articles.reverse().forEach(article => {
        createArticle(article)
    });

    var topicSelect = document.getElementById("topic-list")
    Object.keys(articles).forEach(k => {
        var option = document.createElement("option")
        option.innerHTML = k
        option.value = k
        option.addEventListener("click", () => {
            createArticle(null, k)
        })
        topicSelect.appendChild(option)
    })
}

function saveData() {
    var cn = [...document.getElementById("article-container").childNodes];

    var innerContent = cn.filter(node => {
        return node.id != "articleTemplate" && node.nodeName == "DIV";
    }).map(node => {

        return {
            authorName: node.querySelector('input[class="author-name"]').value,

            essayTitle: node.querySelector('input[class = "essay-title"]').value,

            baseParagraph: node.querySelector('p[name="plainParagraph"]').innerHTML.trim(),

            dateCreated: node.querySelector('time').innerHTML.trim(),

            sentanceSummaries: [...node.querySelector('.noteHolder').querySelectorAll('input')].map(sn => {
                return sn.value;
            }),

            textAreaContent: node.querySelector('textarea').value
        }
    });

    var data = JSON.stringify({ articles: innerContent });

    localStorage.setItem("data", data);
}

function createArticle(aData, key) {
    var template = document.getElementById("articleTemplate");
    var clone = template.cloneNode(true);
    clone.removeAttribute("id")

    var authorName = clone.querySelector('input[class="author-name"]');
    var date = clone.querySelector('time');
    var essayTitle = clone.querySelector('input[class = "essay-title"]')
    var p1 = clone.querySelector('p[name="plainParagraph"]');
    var p2 = clone.querySelector('p[name="buttonParagraph"]');
    var noteHolder = clone.querySelector('div[name="noteHolder"]');
    var textArea = clone.querySelector('textarea');
    var sentenceCount = 0;

    if (aData) {
        authorName.value = aData.authorName;
        date.innerHTML = aData.dateCreated;
        essayTitle.value = aData.essayTitle;
        p1.innerHTML += aData.baseParagraph;
        textArea.value = aData.textAreaContent;
    } else {
        var d = new Date();
        date.innerHTML = d.getMonth() + "-" + d.getDate() + "-" + d.getFullYear();
        p1.innerHTML += articles[key]

        //when new article is created transition out from red
        clone.classList.add("red-background")
        setTimeout(() => {
            clone.classList.remove("red-background")
        }, 1)
    }

    p1.innerHTML.split(/(?<=[.?!])/).forEach(sentance => {
        // make every word in the paragraph into a button
        sentance.split(" ").forEach(word => {
            if (word != " " && word != "" && word != "\n") {
                var button = document.createElement("button")
                button.innerText = word
                button.name = "sentance" + sentenceCount
                button.addEventListener("click", () => {
                    deliminators.forEach(d => {
                        word = word.replace(d, "")
                    })
                    noteHolder.querySelector("input[name=" + button.name + "]").value += word + " ";
                    saveData();
                });
                p2.appendChild(button)
            }
        })

        // create sentance summery inputs
        if (/\S/.test(sentance)) {
            var newInput = document.createElement("input")
            newInput.type = "text"
            newInput.name = "sentance" + sentenceCount
                // if theres saved content add it to the input
            if (aData) {
                newInput.value = aData.sentanceSummaries[sentenceCount]
            }
            noteHolder.appendChild(newInput)
        }
        sentenceCount++
    })
    document.getElementById("article-container").prepend(clone);
    saveData()
}

function deleteCard(card) {
    card.parentNode.parentNode.parentNode.removeChild(card.parentNode.parentNode)
    localStorage.clear()
    saveData()
}