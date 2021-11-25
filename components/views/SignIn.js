
import {Button} from "antd"

import { getAuth , signInWithPopup , GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/dist/client/router";
import firbaseApp from "../../net/firebaseApp"

const auth = getAuth(firbaseApp);

export default function SignIn(){
    const router = useRouter();
    return(
        <div className="flex justify-center items-center h-screen">
            <Button onClick={ async () => {
                const auth = getAuth(firbaseApp)
                const provider = new GoogleAuthProvider();
                provider.addScope('profile');
                provider.addScope('email');
                const result = await signInWithPopup(auth, provider);
                
                const {email} = result.user;
            }}>로그인</Button>
        </div>
    )
}