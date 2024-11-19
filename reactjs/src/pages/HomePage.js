import MyDropzone from "../components/MyDropzone";
import ResultView from "../components/ResultView";
import { useContext, useState } from "react";
import Context from "../context/common";
import DropDownPage from "./DropDownPage";

function HomePage() {

  const { documents } = useContext(Context)


    return (
      <div>
        <h1>upload</h1>
        <MyDropzone />
        <DropDownPage />
      </div>
      
    );
  }

  export default HomePage;