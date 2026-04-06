// 4. Write the function get the get the Extension of file:
// “image.png” => “png”. “Sound.mp3” => “mp3”
function fileExtensionName(filename) {
    return filename.split('.').pop();
}
console.log(fileExtensionName(123));