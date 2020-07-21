import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + "/posts/";

console.log("No posts service, o BACKEND_URL é: " + BACKEND_URL);

@Injectable({ providedIn: 'root'})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject< { posts: Post[], postCount: number } >();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {

    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.http.get<{ message: string; posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
    .pipe(map((postData) => {
      return { posts: postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }),
      maxPosts: postData.maxPosts
    };
  }))
    .subscribe((transformedPostData) => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostData.maxPosts });
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>
    (BACKEND_URL + id);
  }

  addPost(title: string, content: string, image: File) {

    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    console.log("No posts service, dentro do addPost, antes de fazer a call à api, o BACKEND_URL É " + BACKEND_URL);

    this.http.post<{message: string, post: Post }>(BACKEND_URL, postData)
    .subscribe(responseData => {
      this.router.navigate(["/"]);
    });

    console.log("No posts service, dentro do addPost,depois de fazer a call à api, o BACKEND_URL É " + BACKEND_URL);

  }

  updatePost(id: string, title: string, content: string, image: File | string) {

    let postData: Post | FormData;

    if(typeof (image) === "object") {
      // criar form data
      postData = new FormData();
      postData.append("id", id),
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      // passar json
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }

    this.http.put(BACKEND_URL + id, postData)
    .subscribe(response => {
      this.router.navigate(["/"]);
    });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
