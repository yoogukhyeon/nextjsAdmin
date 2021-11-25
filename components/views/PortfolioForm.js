import BaseLayout from "../../components/containers/BaseLayout"
import {Button , Input , Form} from "antd"
import Link from "next/link" 
import firebaseApp from "../../net/firebaseApp";
import {getFirestore ,deleteDoc , collection , addDoc , doc , updateDoc} from "firebase/firestore/lite";
import {getStorage , ref ,  uploadBytes , getDownloadURL} from "firebase/storage"
import { useRouter } from "next/dist/client/router";
import uid from 'tiny-uid';
import { DateTime } from "luxon";
import { useState } from "react";

export default function PortfolioForm({id , portfolio}){
    const [form] = Form.useForm();
    const router = useRouter();
    const [thumbnail , setThumbnail] = useState(portfolio?.thumbnail || null)
    const fireStore = getFirestore(firebaseApp);
    return(
        <BaseLayout>
            포트폴리오 작성 폼
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        subject: portfolio?.subject || '',
                        content: portfolio?.content || ''
                    }}
                    onFinish={ async (value) => {
                       
                        const portFolios = collection(fireStore ,'portfolios')
                        
                        if(!id){
                            const AddDoc = await addDoc(portFolios , {
                                ...value,
                                thumbnail,
                                created_at : new Date(),
                                updated_at: new Date()
                            });
                            console.log('AddDoc' , AddDoc)
                            router.back()
                        }else{
                            const docRef = await doc(fireStore , 'portfolios' , id);
                            const UpdateDoc = await updateDoc(docRef , {
                                ...value,
                                thumbnail,
                                updated_at : new Date(),
                            })
                            console.log('UpdateDoc' , UpdateDoc);
                            router.back();
                        }
                   

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

                    <div className="flex flex-row justify-between">
                        <Form.Item>
                            <Button type="primary" htmlType="submit">전송</Button>
                        </Form.Item>

                        {id && (
                               <Form.Item>
                               <Button type="danger" onClick={() => {
                                   if(!confirm('정말로 삭제하시겠습까?')) return 
                                    const docRef = doc(fireStore, 'portfolios', id)
                                    deleteDoc(docRef).then(()=> {
                                        router.back();
                                    }).catch(console.warn)

                               }}>삭제</Button>
                           </Form.Item>
                        )}
                    </div>
                    
                    
                </Form>

            <div className="flex flex-row justify-end">
                <Link href="/portfolios">
                    <Button>뒤로가기</Button>
                </Link>
            </div>
        </BaseLayout>
    ) 
}