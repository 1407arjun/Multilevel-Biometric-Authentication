# Multilevel-Biometric-Authentication

The article below explores on building a multilevel authentication service using biometrics which stores the user data and manages sessions on the cloud. The objective is to authenticate the user using his/her biometrics, the face and the voice specifically as they are unique for every user. Some downsides to this approach are that biometric data can still be leaked from the database and these features can be replicated too in some cases. Thus, in order to make the authentication stronger, in this article we are proposing a multilevel approach consisting of facial and voice recognition simultaneously to reduce the chances of mimicking and also enhance the security of the biometric data stored in the database by saving the biometrics as a hash.

## Introduction

The use of technology has increased rapidly over the last decade all over the world. A greater proportion of the population now owns laptops, personal computers, and smart phones, making it easier to access the internet and, as a result, changing the lives of millions of people. All web-based systems that have users and store personal information about those users need a mechanism to keep track of that information. Typically, each system user is assigned a database instance that represents them (their identity). An authentication and authorization mechanism are used to control access to certain information in order to protect the user's identity. Password authentication is the most common method in web-based systems. To access a remote account, users frequently enter a combination of their username and password into a form. Passwords have well-known drawbacks in terms of usability and security. As a result, biometric-based authentication is being promoted. The primary motivation for biometric authentication is usability: users do not need to remember passwords, there is nothing for them to carry, biometric systems are generally simple to use, and scalable in terms of the burden placed on users. Biometric technology can be used to reduce the risk of password sharing, forgetting, losing, and embezzlement.

## Face Recognition

Face recognition is a technology that can identify or verify a subject based on an image, video, or other audio-visual element of his face. This identification is typically used to gain access to an application, system, or service. It is a biometric identification method that uses body measurements, in this case the face and head, to verify a person's identity through its facial biometric pattern and data. To identify, verify, and/or authenticate a person, the technology collects a set of unique biometric data associated with their face and facial expression.

