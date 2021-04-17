# ShakeSearch

Welcome to the Pulley Shakesearch Take-home Challenge! In this repository,
you'll find a simple web app that allows a user to search for a text string in
the complete works of Shakespeare.

You can see a live version of the app at
https://pulley-shakesearch.herokuapp.com/. Try searching for "Hamlet" to display
a set of results.

In it's current state, however, the app is just a rough prototype. The search is
case sensitive, the results are difficult to read, and the search is limited to
exact matches.

## Your Mission

Improve the search backend. Think about the problem from the **user's perspective**
and prioritize your changes according to what you think is most useful. 

## Evaluation

We will be primarily evaluating based on how well the search works for users. A search result with a lot of features (i.e. multi-words and mis-spellings handled), but with results that are hard to read would not be a strong submission. 


## Submission

1. Fork this repository and send us a link to your fork after pushing your changes. 
2. Heroku hosting - The project includes a Heroku Procfile and, in its
current state, can be deployed easily on Heroku's free tier.
3. In your submission, share with us what changes you made and how you would prioritize changes if you had more time.

## Completed

Deployed on https://rocky-hollows-89398.herokuapp.com/

- Redirect invalid routes to home
- Support case-insensitive search
- Highlight matched texts
- Show matches per title/section
- Show number of matched lines per title/section
- Provide some way for users to quickly navigate to each search result assuming they have access to full article (went with line number here)
- Show matched line, line before, and line after for context
- Fix bug on client where 'tr's weren’t closed properly, and text wasn’t added to 'td's inside 'tr's
preserve formatting/spacing of original text
- Allow searching phrases or multiple words


## Future Improvements

- Improve performance for queries of very common/frequent words, including search terms less than 3 characters
- Spawn child processes to handle multiple requests at once
- Show errors on UI
- Show loading indicator on UI
- Allow searching with regex
- On clicking line on UI, link out to a page containing the full article and scroll down to the clicked line
- Make UI nicer and more visually appealing
- Show total matches for each title/article instead of lines matched (for multiple matches in a single line)
- Improve accessibility

