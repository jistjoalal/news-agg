# simple news aggregate
hackernews + reddit aggregate starting with the code from
[Robin Wieruch's](https://www.robinwieruch.de/) Road To React Book.

![demo pic](https://i.gyazo.com/89e06488d91d06b9e683eb31c08dde86.png)
Aggregate the aggregates!

## Try it out
1. `git clone git@github.com:jistjoalal/news-agg.git`
2. `cd news-agg`
3. `npm install`
4. `npm start`

## More ideas / takeaways
- Add more sources
- Play around with GraphQL
  - It would be cool to not be overfetching data everytime the search input changes
- Learn how to actually test. (Snapshot and render tests are about all I learned from roadtoreact book)
- Learn state mgmt. library. There has to be a better way:

```js
// caches fetched results
  cacheResults = ({ hits, page }) => {
    this.setState(({ results, lastSource, lastSearchKey }) => {
    // catch null results (cant spread null):
    //   null results[source] = {}
    //   null results[source][searchKey] = {}
    //   null results[source][searchKey].hits = []
    const sourceResults = results && results[lastSource] ?
      {...results}[lastSource] : {};
    const searchResults = sourceResults && sourceResults[lastSearchKey] ?
      {...sourceResults}[lastSearchKey] : {};
    const oldHits = searchResults.hits || [];
    return {
      // keep old results (other sources)
      results: { ...results,
        // keep old results[source] (other searchKeys)
        [lastSource]: { ...sourceResults,
          [lastSearchKey]: {
            // append new hits + page
            hits: [...oldHits, ...hits],
            page
          }
        }
      },
      isLoading: false
    }
  })}
```
That's just the caching. I have to do that weird nested check every time I
mutate the results, or check if a certain result is saved. For some reason
empty object is falsy but invalid key to an object is a hard crash. Hopefully
a state mgmt. library could help untangle this code/my brain.

![javascript is fun](https://i.gyazo.com/863cc9fba6ffb5c1c3004b756e190b09.png)