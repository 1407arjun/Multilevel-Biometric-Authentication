# Multilevel-Biometric-Authentication

The article below explores on building a multilevel authentication service using biometrics which stores the user data and manages sessions on the cloud. The objective is to authenticate the user using his/her biometrics, the face and the voice specifically as they are unique for every user. Some downsides to this approach are that biometric data can still be leaked from the database and these features can be replicated too in some cases. Thus, in order to make the authentication stronger, in this article we are proposing a multilevel approach consisting of facial and voice recognition simultaneously to reduce the chances of mimicking and also enhance the security of the biometric data stored in the database by saving the biometrics as a hash.

## Introduction

The use of technology has increased rapidly over the last decade all over the world. A greater proportion of the population now owns laptops, personal computers, and smart phones, making it easier to access the internet and, as a result, changing the lives of millions of people. All web-based systems that have users and store personal information about those users need a mechanism to keep track of that information. Typically, each system user is assigned a database instance that represents them (their identity). An authentication and authorization mechanism are used to control access to certain information in order to protect the user's identity. Password authentication is the most common method in web-based systems. To access a remote account, users frequently enter a combination of their username and password into a form. Passwords have well-known drawbacks in terms of usability and security. As a result, biometric-based authentication is being promoted. The primary motivation for biometric authentication is usability: users do not need to remember passwords, there is nothing for them to carry, biometric systems are generally simple to use, and scalable in terms of the burden placed on users. Biometric technology can be used to reduce the risk of password sharing, forgetting, losing, and embezzlement.

### Face Recognition

Face recognition is a technology that can identify or verify a subject based on an image, video, or other audio-visual element of his face. This identification is typically used to gain access to an application, system, or service. It is a biometric identification method that uses body measurements, in this case the face and head, to verify a person's identity through its facial biometric pattern and data. To identify, verify, and/or authenticate a person, the technology collects a set of unique biometric data associated with their face and facial expression.

### Voice Recognition

In contrast to passwords or tokens, which require physical input, biometric voice recognition uses the human voice to uniquely identify biological characteristics in order to authenticate an individual. Voice biometric recognition works by recording the voice of the person whose identity must be stored in the system. This input is saved as a print for authentication purposes. The input print is created using software that allows the voice statement to be split into multiple frequencies.

## Proposed Work

We propose a multilevel biometric authentication system wherein facial and voice recognition would be carried out simultaneously. The user would have to get his face authorized while replicating his/her stored audio at the same time. This is done to prevent any form of unauthorized access by images or audio mimicking. At the same time the captured biometric data if the user will be further hashed and stored into the database, thus increasing its security. Thus, we can divide the authentication process into two parts which are carried out simultaneously:

### Face Recognition

The user would be asked to enrol his/her face when registering for the first time. Multiple frames of the user’s face would be captured by the webcam module, with and without the user’s mouth being open. These would then be processed, its features would be extracted and analysed by an OpenCV model post which they would be stored in the system database. Next, when the user is being authenticated, the image of the face of the user would be processed and analysed once again and compared with the features stored in the database. Based on the match, the user would be either accepted or rejected by the system.

### Voice Recognition

Here, the user would be asked to record a sound which would be used to authenticate the user each time. On registration, the user would be asked to provide his/her audio which would then be used to train the speech model frame by frame, by extracting the features from the recorded audio and stored in the database. When a user tries to authenticate, again all the frames from the input audio are analysed and features are extracted and identified from the database. A machine learning algorithm – Support Vector Machines (SVM) is applied on the features which is used to test and authenticate the user.

During the authentication process, the user has to give his/her voice audio while keeping his/her webcam on. Face and voice recognition will be carried out together since, the user’s face with and without the mouth being open was recorded during registration, which will help increase the accuracy of face recognition and lessen errors. Thus, this approach provides a dual layer of security on top of the already existing biometric authentication methods. Finally, the biometric features are hashed using encryption algorithms before storing in the database to prevent data from being misused if leaked
