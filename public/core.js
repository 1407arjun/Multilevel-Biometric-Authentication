var thingsToRead = [
    "Never gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you",
    "There's a voice that keeps on calling me\n	Down the road, that's where I'll always be.\n	Every stop I make, I make a new friend,\n	Can't stay for long, just turn around and I'm gone again\n	\n	Maybe tomorrow, I'll want to settle down,\n	Until tomorrow, I'll just keep moving on.\n	\n	Down this road that never seems to end,\n	Where new adventure lies just around the bend.\n	So if you want to join me for a while,\n	Just grab your hat, come travel light, that's hobo style.",
    "They're the world's most fearsome fighting team \n	They're heroes in a half-shell and they're green\n	When the evil Shredder attacks\n	These Turtle boys don't cut him no slack! \n	Teenage Mutant Ninja Turtles\nTeenage Mutant Ninja Turtles",
    "If you're seein' things runnin' thru your head \n	Who can you call (ghostbusters)\n	An' invisible man sleepin' in your bed \n	Oh who ya gonna call (ghostbusters) \nI ain't afraid a no ghost \n	I ain't afraid a no ghost \n	Who ya gonna call (ghostbusters) \n	If you're all alone pick up the phone \n	An call (ghostbusters)"
]

var Profile = class {
    constructor(name, profileId) {
        this.name = name
        this.profileId = profileId
    }
}
var VerificationProfile = class {
    constructor(name, profileId) {
        this.name = name
        this.profileId = profileId
        this.remainingEnrollments = 3
    }
}
var profileIds = []
var verificationProfile = new VerificationProfile()
