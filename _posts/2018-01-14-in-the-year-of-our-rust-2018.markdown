---
layout: post
title:  "In The Year of Our Lord Rust, 2018 (draft)"
date:   2018-01-14 12:04:56 -0500
categories: jekyll update
---

<style>
  img {
    height: 40%;
    width: 40%;
  }

  #qr-img {
    text-align: center;
  }
</style>

# Rust 2015: a prelude

When I started playing around with Rust a couple years ago, I had no experience in...

1. Types (and by extension, what generic types are)
2. Compiled languages
3. Importance of memory management (lifetimes, etc)
4. Immutability concepts
5. Systems programming
6. Traits!?
7. Hand-wavey understanding of the Stack and Heap

And needless to say, my first few forays were quite frustrating (insert link to "Show your failures"). While I could grok the type system well enough, when it came to generics, I was flabbergasted. I struggled to understand the differences between `String` and `&'str`. That vectors (`Vec<T>`) behaved quite differently in some ways than slices (`&[T]`). The compiler would constantly complain about "moving" and "using". I'd try to use lifetimes and their unusual annotations without fully understanding the **why** behind it. In spite of all of this, I found ways to progress and projects where I could put the knowledge to the test. And that is all due to how supportive and helpful that the Rust community is.

# Community

I recall distinctly asking a question on #rust-beginners on freenode about traits and someone from there took me step by step - first by seeing what I understood so far. Without feigning surprise, he helped me dismantle the pre-conceptions I had - of both what traits are, and how intimidating it was to ask a simple question about Rust. This positivity didn't stop in the virtual world; it also persisted in "meat space". I attended a few Rust meetups at Kickstarter here in NYC, and someone there enthusiastically showed me how to structure a Rust library, something that I have found particularly vexing.

This, and the drastic improvement of the documentation over the past few years has made the language incredibly accessible despite it being a low-level and associated with systems programming. When I started out on Rust, I never thought I'd be able to make anything out of it - but I have! Sort of!

I've been writing a [QR encoder](https://github.com/wismer/qr-encode) for a while now and it has produced some interesting attempts:

<div id='qr-img'>
  <img src="/assets/img/qr-ex-1.png">
</div>

Having been fortunate enough to get this far (relatively) far in Rust, I have seen the documentation constantly improve.

As I know quite well from my years of volunteering through [ScriptEd](https://scripted.org), teaching programming concepts even basic ones is not an easy task.
