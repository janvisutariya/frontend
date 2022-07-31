import {useEffect, useState} from "react";
import * as service from "../../services/tuits-service";
import Tuits from "../tuits";

const MyTuits = () => {
    const [tuits, setTuits] = useState([]);
    const findMyTuits = () =>
        service.findTuitByUser("my")
            .then(tuits => setTuits(tuits));
    useEffect(findMyTuits, []);
    return(
        <div>
            <h1>Tuits</h1>
            <Tuits tuits={tuits}
               refreshTuits={findMyTuits}/>
        </div>
        
    );
};

export default MyTuits;