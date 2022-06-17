import useAxios from '../hooks/useAxios';
import axios from '../apis/base';
import ExampleResponse from '../protos/ExampleResponse.proto';

function App() {

    const [msg, error, loading] = useAxios({
        axiosInstance: axios,
        method: "GET",
        url: "/hello/protobuf",
        requestConfig: {
            pb: {
                response: ExampleResponse,
            }
        }
    })

    return (
        <div className="App">
            {loading && <p>loading...</p>}

            {!loading && error && <p>{error}</p>}

            {!loading && !error && msg && <p>{JSON.stringify(msg)}</p>}
        </div>
    );
}

export default App;