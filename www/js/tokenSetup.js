const MY_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXdvcGxhdGZybS1ibG9nLWFwcC5hdHdlYnBhZ2VzLmNvbSIsImlhdCI6MTc3MDYwMTMxNiwibmJmIjoxNzcwNjAxMzE2LCJleHAiOjE3NzEyMDYxMTYsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifX19.cP4u5JvkBY_dmG2XgCjtU8klrW43OTQmi7JKqTMUVjE";

// Save it if not already saved
if (!localStorage.getItem('wp_token')) {
    localStorage.setItem('wp_token', MY_TOKEN);
    console.log('Token set for all pages');
}