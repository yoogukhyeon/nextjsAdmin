import BaseLayout from "../../components/containers/BaseLayout";
import {Button} from "antd"
import Link from "next/link"
import { useEffect, useState } from "react";
import firebaseApp from "../../net/firebaseApp";
import {getFirestore , collection , getDocs} from "firebase/firestore/lite"
import { DateTime } from "luxon";
import {image} from "next/image"
function Item({portfolio}){
    return(
        <li className="flex flex-row justify-between items-center py-3 border-b" >
            <div>
               {portfolio.thumbnail ?    <img src={portfolio.thumbnail} alt="image" className="max-w-16 max-h-16" /> : "이미지 없음"}
              
            </div>
            <div>
                <Link href={`/portfolios/${portfolio.id}`}>
                    <a>
                        {portfolio.subject}
                    </a>
                </Link>
            </div>
            <div>
                {DateTime.fromSeconds(portfolio.created_at.seconds).toFormat('yyyy-LL-dd')}
            </div>
        </li>
    )
}



export default function PortfolioList(){
    const [portfolios , setPortFolios] = useState([])
    useEffect( () => {
        async function fetchData() {
            const firestore = getFirestore(firebaseApp);
            const portFolios = collection(firestore ,'portfolios')
            const GetDoc = await getDocs(portFolios);
            setPortFolios(GetDoc.docs.map( doc => ({
                    id : doc.id,
                    ...doc.data()
            })).sort(( x , y) => x.created_at.seconds < y.created_at.seconds ? 1 : -1)
        )
          }
          fetchData();


      
            
    }, [])
    return(
        <BaseLayout>
            포트폴리오 리스트

            <ul>
                {portfolios.map( portfolio => (<Item key={portfolio.id} portfolio={portfolio} />))}
            </ul>


            <div className="flex flex-row justify-end">
                <Link href="/portfolios/create">
                    <Button>추가</Button>
                </Link>
            </div>
        </BaseLayout>
    )
}