import { useEffect, useState } from "react"
import { BiArrowBack } from 'react-icons/bi'
import { ImgUploader } from "./img-uploader"
import { uploadService } from "../services/upload.service"
import { userService } from "../services/user.service"
import { updateUser } from "../store/user.actions"
import { UserAvatar } from "./user-avatar"


export function UserProfile({ currDimensions, toggleUserProfile, user }) {

    const [isUploading, setIsUploading] = useState(false)
    const [imgData, setImgData] = useState({
        imgUrl: null,
        height: 500,
        width: 500,
    })


    async function uploadImg(ev) {
        setIsUploading(true)
        const { secure_url, height, width } = await uploadService.uploadImg(ev)
        setImgData({ imgUrl: secure_url, width, height })
        let userToSave = { ...user, imgUrl: secure_url }
        await updateUser(userToSave)
        setIsUploading(false)
        // onUploaded && onUploaded(secure_url)
    }



    return (
        <div className="user-profile flex column" style={{ width: `${currDimensions.width}px`, height: `${currDimensions.height}px` }}>
            <header className="flex align-end">
                <BiArrowBack className="arrow-icon pointer" onClick={() => toggleUserProfile((prev) => !prev)} />
                <section className="head">Profile</section>
            </header>
            <section className="main-user-section flex column align-center" >

                <label htmlFor="imgUpload">
                    <UserAvatar
                        imgUrl={user.imgUrl}
                        dimensions={{ width: '15rem', height: '15rem' }}
                    />
                    <input type="file" onChange={uploadImg} accept="img/*" id="imgUpload" className="img-input" />
                </label>

                <div className="name-container">
                    <div className="title">
                        Your name
                    </div>
                    <div className="input-container">
                        <input type="text" value={user.username}/>
                    </div>
                </div>

            </section>
            {/* <ImgUploader /> */}
        </div>
    )
}