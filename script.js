const fileSubmit = document.querySelector("#fileSubmit")
const previewContainer = document.querySelector("#previewContainer")

fileSubmit.onclick = event => {
    const file = fileInput.files[0]

    const reader = new FileReader();

    reader.addEventListener('load', (event) => {
        resourceCards = processData(event.target.result)
    });

    reader.readAsText(file);
}

const processData = (data) => {
    console.log("Processing...")
    let rows = data.split("\n")
    let cardKeys = rows[0].slice(0, -1).split("\t")
    window.data = data
    for (let i = 1; i < rows.length; i++) {
        let row = rows[i]
        let cardObject = {}
        let splitRow = row.split("\t")
        for (let i = 0; i < splitRow.length; i++) {
            cardObject[cardKeys[i].toLowerCase()] = splitRow[i]
        }
        let cardElement = makeCardElement(cardObject)
        // previewContainer.appendChild(cardElement)
    }
}

const makeCardElement = (data) => {
    let card = document.createElement("div")
    card.className = "card-container"

    let topBar = document.createElement("div")
    topBar.className = "top-bar"
    card.appendChild(topBar)

    let name = document.createElement("div")
    name.className = "card-name"
    name.innerText = data.name
    topBar.appendChild(name)

    if (data.danger === "yes") {
        let dangerIcon = document.createElement("img")
        dangerIcon.src = "other-icons/danger.png"
        dangerIcon.className = "small-icon"
        topBar.appendChild(dangerIcon)
    }

    let mainContent = document.createElement("div")
    mainContent.className = "main-content"
    card.appendChild(mainContent)

    let attackContainer = undefined
    if (data.monster) {
        attackContainer = document.createElement("div")
        attackContainer.className = "attack-container"
        mainContent.appendChild(attackContainer)
    
        let monsterName = document.createElement("div")
        monsterName.innerHTML = `<b>${data.monster}</b>`
        attackContainer.appendChild(monsterName)
        
        if (data["monster description"]) {
            let monsterDescription = document.createElement("div")
            monsterDescription.innerText = data["monster description"]
            attackContainer.appendChild(monsterDescription)
        }

        attackContainer.appendChild(
            document.createElement("br")
        )
        
        let attackName = document.createElement("div")
        attackName.innerHTML = `<b>Attack: </b>`
        attackName.innerHTML += data.attack
        attackContainer.appendChild(attackName)
    
        let attackDamage = document.createElement("div")
        attackDamage.classList.add("card-text")
        attackDamage.innerHTML = addIcons(data.damage, "small")
        attackContainer.appendChild(attackDamage)
        
        attackContainer.appendChild(
            document.createElement("br")
        )
        
        let defense = document.createElement("div")
        defense.innerHTML = `<b>Defense: ${data.defense}</b>`
        attackContainer.appendChild(defense)
        
        let weaknessesLabel = document.createElement("div")
        weaknessesLabel.innerText = `Weaknesses:`
        attackContainer.appendChild(weaknessesLabel)
        
        if (data.weaknesses) {
            let weaknessesContainer = document.createElement("div")
            for (let weakness of data.weaknesses.split(", ")) {
                let icon = document.createElement("img")
                icon.className = "icon"
                if (weakness === "food" || weakness === "treasure") {
                    icon.src = `other-icons/${weakness}.png`
                } else {
                    icon.src = `resource-icons/${weakness}.png`
                }
                weaknessesContainer.appendChild(icon)
            }
            attackContainer.appendChild(weaknessesContainer)
        }

        if (data["how to resolve"]) {
            let resolve = document.createElement("div")
            resolve.innerHTML = data["how to resolve"]
            attackContainer.appendChild(resolve)
        }
    }

    if (data["non-monster danger"]) {
        attackContainer = document.createElement("div")
        attackContainer.className = "attack-container"
        mainContent.appendChild(attackContainer)
    
        let dangerName = document.createElement("div")
        dangerName.innerHTML = `<b>${data["non-monster danger"]}</b>`
        attackContainer.appendChild(dangerName)
        
        if (data["non-monster danger description"]) {
            let dangerDescription = document.createElement("div")
            dangerDescription.innerText = data["non-monster danger description"]
            attackContainer.appendChild(dangerDescription)
        }
        
        if (data["how to resolve"]) {
            let howToResolve = document.createElement("div")
            howToResolve.classList.add("card-text")
            howToResolve.innerHTML = addIcons(data["how to resolve"], "small")
            attackContainer.appendChild(howToResolve)
        }
    }

    if (data["trade partners"]) {
        let tradeContainer = document.createElement("div")
        tradeContainer.className = "prevent-container"
        
        let nameBar = document.createElement("div")
        // let merchantIcon = document.createElement("img")
        // merchantIcon.className = "icon"
        // merchantIcon.src = "other-icons/merchant.png"
        // nameBar.innerText += data["trade partners"]
        // nameBar.appendChild(merchantIcon)
        tradeContainer.appendChild(nameBar)
    
        let tradeDescription = document.createElement("div")
        tradeDescription.innerHTML = data["trade partner description"]
        tradeContainer.appendChild(tradeDescription)
    
        tradeContainer.appendChild(
            document.createElement("br")
        )
    
        if (data.seeking) {
            let seekingLabel = document.createElement("div")
            seekingLabel.innerText = "Seeking:"
            tradeContainer.appendChild(seekingLabel)
    
            let seekingContainer = document.createElement("div")
            seekingContainer.className = "seeking-container"
            for (let symbol of data.seeking.split(", ")) {
                let icon = document.createElement("img")
                icon.className = "icon"
                if (symbol === "treasure" || symbol === "food") {
                    icon.src = `other-icons/${symbol}.png`
                } else {
                    icon.src = `resource-icons/${symbol}.png`
                }
                seekingContainer.appendChild(icon)
            }
            tradeContainer.appendChild(seekingContainer)
        }
    
        if (data["special trades"]) {
            let special = document.createElement("div")
            special.classList.add("card-text")
            special.innerHTML = `Special Trades: ${addIcons(data["special trades"], "small")}`
            tradeContainer.appendChild(special)
        }
    
        mainContent.appendChild(tradeContainer)
    }

    let tunerContainer = undefined
    if (data.tuner) {
        tunerContainer = document.createElement("div")
        tunerContainer.className = "prevent-container"

        nameBar = document.createElement("div")
        nameBar.innerHTML += `<b>Tuner</b>`
        tunerContainer.appendChild(nameBar)

        if (data.tuner !== "Tuner") {
            nameBar.innerHTML += `: ${data.tuner}`
        }

        if (data["tuner description"]) {
            let tradeDescription = document.createElement("div")
            tradeDescription.innerHTML = data["tuner description"]
            tunerContainer.appendChild(tradeDescription)
            
            tunerContainer.appendChild(
                document.createElement("br")
            )
        }
        
        let tunerFee = document.createElement("div")
        tunerFee.classList.add("card-text")
        tunerFee.innerHTML = `Tuner's Fee: ${addIcons(data["tuner fee"], "small")}`
        tunerContainer.appendChild(tunerFee)
        
        if (data["special instructions for the tuner"]) {
            tunerContainer.appendChild(
                document.createElement("br")
            )
            let special = document.createElement("div")
            special.classList.add("card-text")
            special.innerHTML = `Special Tuner Instructions: ${addIcons(data["special instructions for the tuner"])}`
            tunerContainer.appendChild(special)
        }

        mainContent.appendChild(tunerContainer)
    }

    let healerContainer = undefined
    if (data["healer"]) {
        healerContainer = document.createElement("div")
        healerContainer.className = "prevent-container"
        
        let nameBar = document.createElement("div")
        nameBar.innerText += data["healer"]
        healerContainer.appendChild(nameBar)
    
        let healerDescription = document.createElement("div")
        healerDescription.innerHTML = data["healer description"]
        healerContainer.appendChild(healerDescription)
    
        healerContainer.appendChild(
            document.createElement("br")
        )
    
        let healerFee = document.createElement("div")
        healerFee.classList.add("card-text")
        healerFee.innerHTML = `Healer's Fee: ${addIcons(data["healer fee"], "small")}`
        healerContainer.appendChild(healerFee)
    
        mainContent.appendChild(healerContainer)
    }

    if (data["secondary trading partner"]) {
        let tradeContainer = document.createElement("div")
        tradeContainer.className = "prevent-container"
        
        let nameBar = document.createElement("div")
        // let merchantIcon = document.createElement("img")
        // merchantIcon.className = "icon"
        // merchantIcon.src = "other-icons/merchant.png"
        nameBar.innerText += data["secondary trading partner"]
        // nameBar.appendChild(merchantIcon)
        tradeContainer.appendChild(nameBar)
    
        let tradeDescription = document.createElement("div")
        tradeDescription.innerHTML = data["secondary trading partner description"]
        tradeContainer.appendChild(tradeDescription)
    
        tradeContainer.appendChild(
            document.createElement("br")
        )

        if (data["secondary trading partner seeking"]) {
            let seekingLabel = document.createElement("div")
            seekingLabel.innerText = "Seeking:"
            tradeContainer.appendChild(seekingLabel)
    
            let seekingContainer = document.createElement("div")
            seekingContainer.className = "seeking-container"
            for (let symbol of data["secondary trading partner seeking"].split(", ")) {
                let icon = document.createElement("img")
                icon.className = "icon"
                if (symbol === "treasure" || symbol === "food") {
                    icon.src = `other-icons/${symbol}.png`
                } else {
                    icon.src = `resource-icons/${symbol}.png`
                }
                seekingContainer.appendChild(icon)
            }
            tradeContainer.appendChild(seekingContainer)
        }
    
        if (data["secondary trade offered"]) {
            let special = document.createElement("div")
            special.classList.add("card-text")
            special.innerHTML = `Special Trades: ${addIcons(data["secondary trade offered"], "small")}`
            tradeContainer.appendChild(special)
        }
    
        if (data.tuner || data.healer) {
            tradeContainer.classList.add("sub-item")
        }

        if (data.tuner) {
            tunerContainer.append(tradeContainer)
        } else if (data.healer) {
            healerContainer.append(tradeContainer)
        } else {
            mainContent.appendChild(tradeContainer)
        }
    }

    if (data.loot) {
        let loot = document.createElement("div")
        loot.classList.add("card-text")
        loot.innerHTML = `<b>Loot: ${addIcons(data.loot, "small")}</b>`
        
        if (attackContainer) {
            attackContainer.appendChild(loot)
        } else {
            let lootContainer = document.createElement("div")
            lootContainer.className = "loot-container"
            lootContainer.appendChild(loot)
            card.appendChild(lootContainer)
        }
    }


    if (
        data["special instructions for the card"] &&
        data["special instructions for the card"] !== "\r"
        ) {
        let special = document.createElement("div")
        special.className = "prevent-container"
        special.innerHTML = `Special Instructions: ${data["special instructions for the card"]}`
        mainContent.appendChild(special)
    }

    if (mainContent.childNodes.length === 1) {
        mainContent.childNodes[0].classList.add("double-wide")
    }

    previewContainer.appendChild(card)

    setTimeout(() => {
        console.log(data.name)
        console.log(getInnerNodesHeight(card))
        console.log(getNodeHeight(card))
        if (getInnerNodesHeight(card) + 10 > getNodeHeight(card)) {
            card.classList.add("compact")
            setTimeout(() => {
                if (getInnerNodesHeight(card) + 10 > getNodeHeight(card)) {
                    card.classList.remove("compact")
                    card.classList.add("extra-compact")
                }
            }, 2000)
        }
    }, 3000)
}

const keywordOrder = {
    magic: 1, range: 2, blade: 3, harpoon: 4, iron: 5, bone: 6, salt: 7, poison: 8, citrus: 9, whiskey: 10, fire: 11, navigation: 12, visibility: 13, mending: 14, repair: 15, medicine: 16,
}

const sortKeywords = (keywords) => {
    return keywords.sort((firstItem, secondItem) => keywordOrder[firstItem] - keywordOrder[secondItem]);
}

const addIcons = (text) => {
    const resourceIcons = Object.keys(keywordOrder);

    // Use a regular expression to match words enclosed in square brackets
    const wordRegex = /\[(\w+)]/g

    // Replace words in the text using the regular expression
    const replacedText = text.replace(wordRegex, (match, word) => {
        // If the word is in the resourceIcons array, replace it with an image
        if (resourceIcons.includes(word)) {
            return `<img class='icon' src='resource-icons/${word}.png'></img>`;
        }
        // If it's one of the common words, replace it with a small icon
        else if (["treasure", "food", "merchant", "danger"].includes(word)) {
            return `<img class='icon' src='other-icons/${word}.png'></img>`;
        }
        // If it's not in the lists, keep it as is
        return match;
    });

    const boldRegex = /\*[^*]+\*/g

    const newReplacedText = replacedText.replace(boldRegex, (match, word) => {
        return `<b>${match.slice(1, -1)}</b>`
    })

    return newReplacedText;
};


let keywordCounter = {}
let resourceCards;

let drawCardsToPaper = () => {
    previewPrompt.classList.add("nondisplay")
    document.body.style.backgroundColor = "#000"
    let cards = previewContainer.childNodes
    let pages = []
    for (let i = 0; i - 1 <= cards.length / 4; i++) {
        let newPage = document.createElement("canvas")
        newPage.width = 2550
        newPage.height = 3300
        newPage.className = "paper-canvas"
        pageStack.appendChild(newPage)
        pages.push(newPage)
        const ctx = newPage.getContext("2d");
        ctx.font = "70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.fillText(i + 1, 2350, 3100);
    }

    console.log("Cards:")
    console.log(cards)
    cards.forEach((card, index) => {
        setTimeout(function () {
            html2canvas(card).then(canvas => {
                let currentPage = pages[Math.floor(index / 4) + 1]
                console.log("currentPage:", currentPage)
                let x = 0
                let y = 0
                if (index % 4 === 1) {
                    x = 1100
                }
                if (index % 4 === 2) {
                    y = 950
                }
                if (index % 4 === 3) {
                    x = 1100
                    y = 950
                }
                canvas.data = {}
                let ctx = currentPage.getContext("2d", { willReadFrequently: true })
                ctx.drawImage(canvas, x + 50, y + 50, 1068, 772)
            });
        }, index * (index > 50 ? 1000 : 7000))
        console.log(`Timeout set for ` + index * (index > 50 ? 1000 : 7000))
    })

    let reportPage = pages[0]
    let reportContext = reportPage.getContext("2d");
    reportContext.font = "70px sans-serif";
    reportContext.fillStyle = "#000";
    let printY = 200
    reportContext.fillText(`${cards.length} Island Cards`, 100, printY);
    printY += 100
    
    let validKeywords = []

    for (const keyword in keywordCounter) {
        if (keywordOrder[keyword]) {
            validKeywords.push([keyword, keywordCounter[keyword]])
        } else {
            reportContext.fillText(`unrecognized keyword: "${keyword}" (${keywordCounter[keyword]})`, 100, printY);
            printY += 100
        }
    }

    validKeywords = validKeywords.sort((a, b) => {
        return b[1] - a[1]
    })
}

const getInnerNodesHeight = (node) => {
    let total = 0
    for (let childNode of node.childNodes) {
        total += childNode.getBoundingClientRect().height
    }
    return total
}

const getNodeHeight = (node) => {
    return node.getBoundingClientRect().height
}

function boldAttacks(inputString) {
    const regex = /hull|sails|crew/g;
    const resultString = inputString.replace(regex, (match) => `<b>${match}</b>`);
    return resultString;
}  

previewPrompt.onclick = drawCardsToPaper
