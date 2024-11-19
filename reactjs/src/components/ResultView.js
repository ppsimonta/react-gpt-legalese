import EditableText from "./EditableText";

function ResultView({ document }) {

    const offset = Math.round(Math.random() * 360)
    
    return (
        <div className="flex">
            <div className="flex-initial w-1/3">
            <h2 className="text-2xl">Original</h2>
                <div className=" p-2 h-screen overflow-y-auto">
                    {document.original_layer.map((item, index) => (
                        <EditableText className="whitespace-pre-wrap" style={{backgroundColor: `hsl(${index * 135 + offset}, 100%, 85%)`}} key={index}>{item}</EditableText>
                    ))}
                </div>
            </div>
            <div className="flex-initial w-1/3 p-2">
            <h2 className="text-2xl">Brief overview</h2>
                <div className=" p-2 h-screen overflow-y-auto">
                    {document.explanation_layer.map((item, index) => (
                        <EditableText className="whitespace-pre-wrap" style={{backgroundColor: `hsl(${index * 135 + offset}, 100%, 85%)`}} key={index}>{item}</EditableText>
                    ))}
                </div>
            </div>
            <div className="flex-initial w-1/3 p-2">
                <h2 className="text-2xl">What action is required on my part?</h2>
                <div className=" p-2 h-screen overflow-y-auto">
                    {document.action_layer.map((item, index) => (
                        <span className="whitespace-pre-wrap" key={index}>{item}<br></br><br></br></span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ResultView;