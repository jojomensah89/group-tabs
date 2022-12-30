const tabs = await chrome.tabs.query({});

const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.title, b.title));

const groups = new Map();

for (const tab of tabs) {
    const url = new URL(tab.url);
    const title = url.hostname;

    if (!groups.has(title)) {
        groups.set(title, []);
    }

    groups.get(title).push(tab);
}


const button = document.querySelector("button");
button.addEventListener("click", async () => {
    for (const [title, tabGroup] of groups) {
        const tabIds = tabGroup.map(({ id }) => id);
        await chrome.tabs.group({ tabIds }, group => {
            chrome.tabGroups.update(group, { title });
        });
    }
});