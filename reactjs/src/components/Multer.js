
function Multer() {
  
  return (
    <div className="container">
        <h1>File Upload</h1>
        <form action="http://localhost:8080/upload" method="POST" encType="multipart/form-data">
            <div className="file-field input-field">
              <div className="btn grey">
                <input type="file" name="myImage"/>
              </div>
            </div>

            <button className="btn" type="submit">Submit</button>

          </form>
    </div>
)}


export default Multer;