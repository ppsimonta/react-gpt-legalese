import { useState } from "react";

function EditableText(props) {

    const [editMode, setEditMode] = useState(false); 

    const toggleEditMode = () => {
        if (editMode) {
            setEditMode(false);
        } else {
            setEditMode(true);
        }
    }

    if (editMode) {
        return <textarea className={props.className} style={{ ...props.style, height: '50%', width: '100%' }} defaultValue={props.children} onBlur={toggleEditMode} autoFocus={true}></textarea>
    } else {
        return <span className={props.className} style={props.style} onClick={toggleEditMode}>{props.children}</span>
    }
}

export default EditableText;