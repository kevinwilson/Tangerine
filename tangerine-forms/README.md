# Tangerine Forms

```
## system dependencies
npm install -g bower http-server
## get the code
git clone git@github.com:tangerine-community/tangerine
cd tangerine
git checkout v3.x.x
## install
cd tangerine-forms
bower install
## start the no-cache server in the tangerine-forms directory
http-server -c-1
```

Note how there is a forms directory at `./tangerine-forms/forms/` where each form has its own directory. In each of those directoryies there is a `form.html` which describes the item flow of the form and the top level skip logic and then a corresponding item HTML file for each item. A `form.html` __must__ have a `<tangy-form id="...">` tag where the id property is important for distinguishing form response records in the database. If an item HTML file is going to have form elements, it must have a top level `<form>` tag that the form elements are children of. The `./tangerine-forms/form-1/` form is currently the best example of the capabilities of Tangerine Forms while the EGRA Demo form is a work in progress and is not taking advantage of all the new features.

To create a new form, create a folder in `./tangerine-forms/forms/<your form name>`, a new form HTML file at `./tangerine-forms/forms/<your form name>/form.html`, and then add it to the `./tangerine-forms/forms.json` file so that it will show up in the list of forms available in the UI.