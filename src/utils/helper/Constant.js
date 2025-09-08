import { useAuthContext } from "../../context/AuthProvider";

// const Authorization_header() = {headers: { Authorization: `Bearer ${token_obj.accessToken}`}};
let tokens = localStorage.getItem('tokens');
let token_obj = JSON.parse(tokens);

// useEffect(() => {
//     tokens = localStorage.getItem('tokens');
//     token_obj = JSON.parse(tokens);
// }, [])

function Authorization_header2()  {
    const tokens = localStorage.getItem('tokens');
    const token_obj = JSON.parse(tokens);
  
    return (
         { Authorization: `Bearer ${token_obj.accessToken}` }
    )
}

function Authorization_header(){
    const tokens = localStorage.getItem('tokens');
    const token_obj = JSON.parse(tokens);
  
    return (
        { headers: { Authorization: `Bearer ${token_obj.accessToken}` } }
    )
}

const Check_Authorised = (message) => {
    const logout = useAuthContext();
    if (message === "session timed out") {
        logout();
    }
}

export { Authorization_header, Authorization_header2,token_obj, Check_Authorised};

// function Authorization_header() {
//     const tokens = localStorage.getItem('tokens');
    
//     // Check if tokens exist
//     if (!tokens) {
//         console.error("No tokens found in localStorage");
//         return {};
//     }

//     try {
//         const token_obj = JSON.parse(tokens);
        
//         // Check if the token object and accessToken are valid
//         if (token_obj && token_obj.accessToken) {
//             return { headers: { Authorization: `Bearer ${token_obj.accessToken}` } };
//         } else {
//             console.error("Invalid token structure or missing accessToken");
//             return {};
//         }
//     } catch (error) {
//         console.error("Error parsing tokens from localStorage", error);
//         return {};
//     }
// }
