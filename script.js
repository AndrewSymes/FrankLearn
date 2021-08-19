articleCount = 0

function createArticle() {
    articleCount++
    var original = document.getElementById("articleTemplate");
    var clone = original.cloneNode(true);
    clone.id = "article" + articleCount

    var count = 0;
    var p1 = clone.querySelector('p[name="plainPeragraph"]');
    var p2 = clone.querySelector('p[name="buttonParagraph"]');
    var noteHolder = clone.querySelector('div[name="noteHolder"]');

    articles[1].split(/(?<=[.?!])/).forEach(sentance => {
        count++
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
                    noteHolder.querySelector("input[name=" + button.name + "]").value += word + " "

                });
                // p2.insertBefore(button, p2.firstChild)
                p2.appendChild(button)
            }
        })

        if (/\S/.test(sentance)) {
            noteHolder.innerHTML += "<input type='text' name='sentance" + count + "'></input>"
        }
    })

    document.getElementById("articleSection").prepend(clone);
}

articles = [
    "The Kyrgyz Revolution of 2010, also known as the Second Kyrgyz Revolution, the Melon Revolution, the April Events or officially as the People's April Revolution, began in April 2010 with the ousting of Kyrgyz president Kurmanbek Bakiyev in the capital Bishkek. It was followed by increased ethnic tension involving Kyrgyz people and Uzbeks in the south of the country, which escalated in June 2010. The violence ultimately led to the consolidation of a new parliamentary system in Kyrgyzstan.",

    "Lake Titicaca is a large, deep, freshwater lake in the Andes on the border of Bolivia and Peru, often called the 'highest navigable lake' in the world. By volume of water and by surface area, it is the largest lake in South America. Lake Titicaca has a surface elevation of 3,812 m (12,507 ft). The 'highest navigable lake' claim is generally considered to refer to commercial craft."
]