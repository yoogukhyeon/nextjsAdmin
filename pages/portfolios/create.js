import BaseLayout from "../../components/containers/BaseLayout"
import {Button , Input , Form} from "antd"
import Link from "next/link" 
import firebaseApp from "../../net/firebaseApp";
import {getFirestore , collection , addDoc} from "firebase/firestore/lite";
import {getStorage , ref , uploadBytes , getDownloadURL} from "firebase/storage"
import { useRouter } from "next/dist/client/router";
import uid from 'tiny-uid';
import { DateTime } from "luxon";
import { useState } from "react";



export default function PortfolioForm(){
    const [form] = Form.useForm();
    const router = useRouter();
    const [thumbnail , setThumbnail] = useState(null)
    return(
        <BaseLayout>
            포트폴리오 작성 폼
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={ async (value) => {
                        const fireStore = getFirestore(firebaseApp);
                        const portFolios = collection(fireStore ,'portfolios')
                        const AddDoc = await addDoc(portFolios , {
                            ...value,
                            thumbnail,
                            created_at : new Date(),
                            updated_at: new Date()
                        });
                        console.log('AddDoc' , AddDoc)
                        router.back()

                    }}
                
                >   
                
                    <Form.Item label="대표 이미지" required>
                        <Input type="file" onChange={ async event => {
                            if(event.target.files.length === 0) return;
                            const storage = getStorage(firebaseApp);
                            const file = event.target.files[0]
                            const dir = DateTime.now().toFormat('yy/LL/');
                            const split = file.name.split('.');
                            const savedPath = `/${dir}${encodeURIComponent(split[0])}-${uid()}.${split[1]}`;
                            const refFile = ref(storage , savedPath)
                            await uploadBytes(refFile , file)
                            const url = await getDownloadURL(refFile)    
                            setThumbnail(url)
                            
                            
                        }}/>

                        {thumbnail && (
                            <p className="mt-3"><img src={thumbnail} alt="image" style={{maxWidth: 200 , maxHeight: 200}} /></p>
                        )}


                    </Form.Item>
                    
                    <Form.Item label="제목" required name="subject">
                        <Input />
                    </Form.Item>

                    <Form.Item label="설명" required name="content">
                        <Input.TextArea />
                    </Form.Item>


                    <Form.Item>
                        <Button type="primary" htmlType="submit">전송</Button>
                    </Form.Item>
                    
                </Form>

            <div className="flex flex-row justify-end">
                <Link href="/portfolios">
                    <Button>뒤로가기</Button>
                </Link>
            </div>
        </BaseLayout>
    )   
}