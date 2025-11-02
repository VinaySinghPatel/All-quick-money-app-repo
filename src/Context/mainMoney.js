import  { useState } from "react";
import MainContext from "./mainContext";
import API_BASE_URL from '../config/api';

const MainMoney = (props) => {
     const initialpost = [];
     const [Posts,Setpost] = useState(initialpost);
     const [MyPosts,MySetpost] = useState([]);

     const GetPost = async () => {
            let Token = localStorage.getItem('Authtoken');
            let userId = localStorage.getItem('userId');
            if(!Token){
                console.log("The Token Are not Found in the Storage");
            }
            try {
                const response = await fetch(`${API_BASE_URL}/api/post/getallpost/${userId}`,{
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authtoken': Token,  
                    },
                })
                let Json = await response.json();
                MySetpost(Json);
                console.log(Json);
            } catch (error) {
                
            }
     };


     const GetAllPost = async (filters = {}, page = 1, limit = 10) => {
        try {
            // Build query string from filters
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            if (filters.city) queryParams.append('city', filters.city);
            if (filters.state) queryParams.append('state', filters.state);
            if (filters.pinCode) queryParams.append('pinCode', filters.pinCode);
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);

            const response = await fetch(`${API_BASE_URL}/api/post/getalldbpost?${queryParams.toString()}`,{
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
            }
            )
                let Json = await response.json();
                
                // Handle both old and new response formats for backward compatibility
                if (Json.posts) {
                    Setpost(Json.posts);
                    return Json; // Return pagination info
                } else {
                    // Old format - array of posts
                    Setpost(Json);
                    return {
                        posts: Json,
                        totalPosts: Json.length,
                        currentPage: 1,
                        totalPages: 1,
                        hasNextPage: false,
                        hasPrevPage: false
                    };
                }
            
        } catch (error) {
            console.log("There is error Occured Herer",error);
            return null;
        }
     }

     
     const AddPost = async (tittle,money,description,mobilenumber) => {
        let Token = localStorage.getItem('Authtoken');
        if(!Token){
            console.log("Token Are Not Exist While AddPost");
        }
        try {
            let response = await fetch(`${API_BASE_URL}/api/post/createpost`,{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authtoken' : Token,
                },
                body : JSON.stringify({tittle,money,description,mobilenumber})
            })
            let post = await response.json();
            Setpost(Posts.concat(post));
            
        } catch (error) {
            console.log("There is an error in AddPost API",error);
        }
     }


     const EditPost = async (id,tittle,money,description,mobilenumber) => {
        let Token = localStorage.getItem('Authtoken');
        if(!Token){
            console.log("Token Are Not Exist While AddPost");
        }
        try {
            await fetch(`${API_BASE_URL}/api/post/updatepost/${id}`,{
                method : 'PUT',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authtoken' : Token,
                },
                body : JSON.stringify({tittle,money,description,mobilenumber})
            })  
            let NewEditPost = JSON.parse(JSON.stringify(Posts));
                for(let i =0; i<NewEditPost.length; i++){
                    if(NewEditPost[i]._id === id){
                        NewEditPost[i].tittle = tittle;
                        NewEditPost[i].money = money;
                        NewEditPost[i].description = description;
                        NewEditPost[i].mobilenumber = mobilenumber;
                        break;
                        }
                }
                MySetpost(NewEditPost);
     }catch{
        console.log("There is an Error there are");
     }
    };


        const DeletePost = async (id) => {
            let Token = localStorage.getItem('Authtoken');
            if(!Token){
                console.log("Token Are Not Exist While AddPost");
            }
            try {
                await fetch(`${API_BASE_URL}/api/post/deletepost/${id}`,{
                    method : 'DELETE',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authtoken' : Token,
                    }
                })
                const NewPost = Posts.filter((post)=>post._id !== id);
                MySetpost(NewPost);  
            } catch (error) {
                console.log("There is an Error occured");
            }
        }

        const GetConversations = async () => {
            let userId = localStorage.getItem('userId');
            if(!userId){
                console.log("User ID not found in storage");
                return { success: false, error: 'User ID not found' };
            }
            try {
                const response = await fetch(`${API_BASE_URL}/api/Chat/conversations/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const json = await response.json();
                return json;
            } catch (error) {
                console.log("Error fetching conversations:", error);
                return { success: false, error: 'Failed to fetch conversations' };
            }
        }

        // Send notification (loan request)
        const sendNotification = async (receiverId, message) => {
            let Token = localStorage.getItem('Authtoken');
            if(!Token){
                console.log("Token not found in storage");
                return { success: false, error: 'Authentication token not found' };
            }
            try {
                const response = await fetch(`${API_BASE_URL}/api/notification/send-notification`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authtoken': Token,
                    },
                    body: JSON.stringify({ receiverId, message: message || 'Loan request' })
                });
                const json = await response.json();
                return json;
            } catch (error) {
                console.log("Error sending notification:", error);
                return { success: false, error: 'Failed to send notification' };
            }
        }

        // Respond to notification (accept/reject)
        const respondToNotification = async (notificationId, response) => {
            let Token = localStorage.getItem('Authtoken');
            if(!Token){
                console.log("Token not found in storage");
                return { success: false, error: 'Authentication token not found' };
            }
            try {
                const apiResponse = await fetch(`${API_BASE_URL}/api/notification/respond`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authtoken': Token,
                    },
                    body: JSON.stringify({ notificationId, response })
                });
                const json = await apiResponse.json();
                return json;
            } catch (error) {
                console.log("Error responding to notification:", error);
                return { success: false, error: 'Failed to respond to notification' };
            }
        }

        // Get all notifications
        const getAllNotifications = async () => {
            let userId = localStorage.getItem('userId');
            if(!userId){
                console.log("User ID not found in storage");
                return { success: false, error: 'User ID not found', data: [] };
            }
            try {
                const response = await fetch(`${API_BASE_URL}/api/notification/all-notifications/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const json = await response.json();
                return json;
            } catch (error) {
                console.log("Error fetching notifications:", error);
                return { success: false, error: 'Failed to fetch notifications', data: [] };
            }
        }

    return(
        <MainContext.Provider value={{MyPosts,Posts,GetAllPost,DeletePost,EditPost,AddPost,GetPost,GetConversations,sendNotification,respondToNotification,getAllNotifications}}>
            {props.children}
        </MainContext.Provider>
    )
}

export default MainMoney;
