# Build angular shell.
cd shell 
./node_modules/.bin/ng build --base-href /tangerine/
cd ..

# Build tangy forms.
cd tangy-forms
npm run build
cd ..

# Build updater
cd app-updater
npm run build
cd ..

# Refresh the build directory.
rm -r build
mkdir build

# Copy build items over.
cp -r app-updater/build/default/* build/
cp app-updater/logo.svg build/logo.svg
cp -r shell/dist build/tangerine
cp -r tangy-forms/build/default build/tangy-forms

