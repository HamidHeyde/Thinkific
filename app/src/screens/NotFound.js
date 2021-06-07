
import './register.css';
import {Link} from 'react-router-dom';

const NotFound = function(){
    return (
        <div className="appWrapper">
            <div className="formWrapper">
                <div className="vrow">
                    <div className="headerMessage noMessage">
                        The Page Does Not Exist
                    </div>
                </div>
                <div className="vrow">
                        <div className="formSubtitle">
                            Return to
                            <Link to="/" className="formLink">Home Page</Link>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default NotFound;