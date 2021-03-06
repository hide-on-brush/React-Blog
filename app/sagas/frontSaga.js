import {take,put,call} from 'redux-saga/effects'
import {get, post} from '../fetch/fetch'
import {actionsTypes as IndexActionTypes} from '../reducers'
import {actionTypes as FrontActionTypes} from '../reducers/frontReducer'


export function* getArticleList (tag,pageNum) {
    yield put({type: IndexActionTypes.FETCH_START});
    try {
        return yield call(get, `/getArticles?pageNum=${pageNum}&isPublish=true&tag=${tag}`);
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* getArticlesListFlow () {
    while (true){
        let req = yield take(FrontActionTypes.GET_ARTICLE_LIST);
        let res = yield call(getArticleList,req.tag,req.pageNum);
        if(res){
            if(res.code === 0){
                res.data.pageNum = req.pageNum;
                yield put({type: FrontActionTypes.RESPONSE_ARTICLE_LIST,data:res.data});
            }else{
                yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.message, msgType: 0});
            }
        }
    }
}

export function* getArticleDetail (id) {
    yield put({type: IndexActionTypes.FETCH_START});
    try {
        return yield call(get, `/getArticleDetail?id=${id}`);
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* getArticleDetailFlow () {
    while (true){
        let req = yield take(FrontActionTypes.GET_ARTICLE_DETAIL);
        let res = yield call(getArticleDetail,req.id);
        if(res){
            if(res.code === 0){
                yield put({type: FrontActionTypes.RESPONSE_ARTICLE_DETAIL,data:res.data});
            }else{
                yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.message, msgType: 0});
            }
        }
    }
}

export function* updateUserAvatarFlow (){
    while(true){
        let req = yield take(FrontActionTypes.UPDATE_USER_AVATAR);
        let res = yield call(updateUserAvatar,req.uid,req.avatar);
        if(res){
         if(res.code==0){
            yield put({type: IndexActionTypes.RESPONSE_USER_INFO,data:res.data});
            yield put({type:IndexActionTypes.SET_MESSAGE,msgContent:'更改头像成功，更改完头像需要重新登陆',msgType:1});
         }
            else{
                yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.message, msgType: 0});
        }
        }
    }
}
export function* updateUserAvatar(uid,avatar){
    yield put({type: IndexActionTypes.FETCH_START})
    try{
        return yield call(post, `/user/useravatar?uid=${uid}&avatar=${avatar}`);
    }
    catch(err){
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
    }
    finally{
        yield put({type: IndexActionTypes.FETCH_END})
    }
}


export function* searchArticleFlow (){
    while(true){
        let req = yield take(FrontActionTypes.GET_SEARCH_ARTICLE);
        let res = yield call(searchArticle,req.key,req.pageNum);
        if(res){
         if(res.code==0){
            res.data.pageNum = req.pageNum;
                yield put({type: FrontActionTypes.RESPONSE_ARTICLE_LIST,data:res.data});
         }
            else{
                yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.message, msgType: 0});
        }
        }
    }
}
export function* searchArticle (key,pageNum){
    yield put({type: IndexActionTypes.FETCH_START})
    try{
        return yield call(get, `/searchArticles?key=${key}&pageNum=${pageNum}`);
    }
    catch(err){
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
    }
    finally{
        yield put({type: IndexActionTypes.FETCH_END})
    }
}