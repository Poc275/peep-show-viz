const SentenceAnnotations = function() {

    this.sentenceAnnotations = [
        // index 0 = average sentence length annotations
        // index 1 = internal vs external ratio annotations
        // index 2 = top noun annotations
        [
            "So for example, Mark's average sentence length was 6 words during the first episode and likewise for Jez. In fact this holds pretty much throughout except for episodes 4 and 5 where Mark's average drops to 5. So much for him being the more learned of the two.",
            "We see for the very first episode Mark nearly had a 50/50 split internal vs external but this tapered off during the series. In contrast Jez started with very few internal lines, but this increased as the series progressed.",
            "Cancer is mentioned a lot during episode 1 as an argument ensues over the doctor's name for Toni's sister. You can see which episode Johnson makes his grand first appearance and in the final episode we see a lot of soul searching going on as Jez contemplates his own existence after Uncle Ray passes away."
        ],
        [
            "So for example, Mark's average sentence length was 6 words during the first episode but only 5 for Jez.",
            "This is the series where Jez has the least amount of internal thoughts compared to other series. This is particularly evident in episodes 2, 4, 5 and 6.",
            "This is the series in which Nancy is introduced for the first time and we can see from Jez's words how much he talks about her. Daryl the racist is prominent in Mark's words from episode 2. This is the same episode where Jez is trying to do the track for Gog's film. Jeff appears at the top of Mark's words on two occasions as he begins to plot his way into breaking up his and Soph's relationship. Jeff also appears in Jez's top words from episode 5 as they form a brief friendship. Student is mentioned by Mark and Jez in episode 4 as they both venture off to Darty, Jez to play a gig (not like Bez) and Mark to stalk April from the shoe shop.",
        ],
        [""],
        [""],
        [""],
        [""],
        [""],
        [""],
        [""],
    ];

    this.audioAnnotations = [
        {
            series: "1",
            index: 546,
            internal: true,
            audio: "sophie.mp3",
            annotation: "Let's zoom in on some memorable lines from the series. Here Mark takes the unorthodox historical approach to love:",
            line: "Yes, that's the way. Sophie's the one. Toni's Russia - vast, mysterious, unconquerable. Sophie's Poland - manageable, won't put up too much of a fight.",
        },
        {
            series: "1",
            index: 604,
            internal: false,
            audio: "voicemail.mp3",
            annotation: "The chart really accentuates the longer lines, be it a prolonged internal monolgue or external rant. Here is the excruciating message left by Mark on Sophie's voicemail:",
            line: "Uh, Sophie. If you heard that, please ignore it, I'm not a racist. Far from it. Anyway uh it's good to hear your voice. I know it's only a recording but you have got a bloody nice voice and... God, I just called up to say hi and then, then I go and spoil it all by saying something stupid like I like you. I mean, not that. But anyway I noticed that the paper in the photocopier is running a bit low so I know it's not really your job but uh well you know, so, uh see you tomorrow.",
        },
        {
            series: "1",
            index: 228,
            internal: true,
            audio: "drugs.mp3",
            annotation: "Jez struggles to recover from a drugs binge the night before. What was the bad thing?",
            line: "Oh, I feel like loam, a piece of loam. Jesus, what am I talking about? I wish Mark was here. No more drugs. I don't need drugs. I mean what great music was ever made on drugs? Bowie, obviously, The Floyd, The Prodge, Aphex - the list is endless really, but they could have done it twice as fast with half the mess if they just... Ahh, was that the bad thing?",
        },
        {
            series: "1",
            index: 236,
            internal: false,
            audio: "ira.mp3",
            annotation: "Here's Jez trying, and failing, to join in with a political debate between Mark and Johnson:",
            line: "What I mean is that they should be more honest. I mean, at least Tony Adams from the IRA, he's like \"Yeah, I shoot people. I like shooting people.\" You know, if they were more honest, then maybe people would vote and not switch straight over when the news comes on.",
        },
        {
            series: "1",
            index: 838,
            internal: true,
            audio: "gay.mp3",
            annotation: "Noticeable are the episodes with more shorter bars because of an extra long outlier. Here Mark performs an experiment to see if he really does fancy Johnson:",
            line: "Good old unfriendly Mr Patel. Never says a word... whether you're buying cornflakes, fabric softener, or gay porn. So here we go, watch without prejudice. I'm just testing the water. I'm a sexual scientist. So OK, I'm keeping in trim. This is fine. Typical evening in, Johnson's doing the spreadsheet. There's nothing to be afraid of. It was very popular with the Romans and they got a lot done. How's it going Johnson? Haha, so quick. Yeah, some good kissing. Maybe I'm just bi-curious? What if that actually was Johnson, would that make me hotter? What about if he had Sophie's face? Or Sophie's body with Johnson's face. Mum, dad, I'm bi-curious. Yeah right, the bum. Nothing wrong with the bum. Ah! That's a little too rich for me! I just don't know!",
        },
        {
            series: "1",
            index: 398,
            internal: false,
            audio: "enya.mp3",
            annotation: "Same goes for Jez in episode 6. This is because of his \"Enya\" speech during Uncle Ray's funeral:",
            line: "Look, what I'm trying to say is that, if I was dying, and I decided that even though I'd never particularly been into, say uh... Enya before, but that now I really, really was into Enya and that in fact I thought Enya was great, and that Enya died for our sins and I wanted an Enya-themed funeral with pictures of Enya and lots and lots of mentions of... Enya, then I think it would be a bit bloody rich for my sister to ban all mention of Enya from my funeral.",
        },
        {
            series: "2",
            index: 478,
            internal: true,
            audio: "kalashnikov.mp3",
            annotation: "Let's zoom in on some of the more memorable lines from the series. Here Mark wonders if he's the type of person to go on a mass shooting spree:",
            line: "Yeah, you won't be so cocky, Jeff, when I come into the office with a Kalashnikov and two hundred rounds of ammunition. I'm probably exactly the sort of person who could end up doing something like that.",
        },
        {
            series: "2",
            index: 511,
            internal: true,
            audio: "freak.mp3",
            annotation: "Here's where Mark tries to let it all out at Rainbow Rhythms:",
            line: "Yeah, sure, honey. Appear to be opening the box while in fact, the lid stays very firmly on. She's buying it! God, it's so easy being a freak, no wonder they're ten a penny. I should get extra marks for not feeling a fucking thing.",
        },
        {
            series: "2",
            index: 150,
            internal: false,
            audio: "democracy.mp3",
            annotation: "Jez tries to convince Mark to let Daryl the racist play music for his upcoming video:",
            line: "It is kind of the same. I mean, aren't we supposed to be living in a multicultural democracy? And isn't that the point? You know, the Jews and the Muslims and the racists all living happily together, side by side, doing and saying whatever the hell they like?",
        },
        {
            series: "2",
            index: 654,
            internal: false,
            audio: "daryl.mp3",
            annotation: "Mark educates Daryl the racist about political correctness:",
            line: "No! I hate political correctness gone mad more than anyone! I don't want to teach the world to sing, that would be horrible, but slavery? The Holocaust? That's just not on! Whereas, \"I Have A Dream\", South Africa, Benetton, it's- you've got to say, fair enough. Yeah?",
        },
        {
            series: "2",
            index: 314,
            internal: false,
            audio: "revels.mp3",
            annotation: "Jez blows the lid on Mark's lie about being a mature student:",
            line: "He's not a mature student. He's been a loan manager for the last five years. He lives with me and he eats ready meals, and we play \"Guess the Revels\" and we watch Men In Black in front of our massive telly and we have a fucking good time.",
        },
        {
            series: "2",
            index: 883,
            internal: true,
            audio: "doomed.mp3",
            annotation: "Mark tries to get to grips with lad culture to try and fit in with Jeff as part of his plan to win Sophie back:",
            line: "OK, going undercover. Jeff's apparent mate, who couldn't possibly be trying to nick his bird from right under his stupid old fashioned nose. Mmm, OK, man-chat topics. Footballer Darren Anderton, figure of ridicule due to repeated injuries. Turkish shepherd, ate his own testicles. NB, ignore tragic earthquake context. Ferrari Testarossa, fast car. Obviously, no need to note that. Shit, I'm making too many notes! Just imbibe the culture. Um, yes. Civilisation is definitely doomed.",
        },
        {
            series: "2",
            index: 351,
            internal: false,
            audio: "geezer.mp3",
            annotation: "Unlike Mark's attempt to imbibe lad culture, Jez has no such problems, in fact, he's probably been spending too much time with Jeff:",
            line: "So, I was gonna twat this geezer. Then it turns out they're both Polish!",
        },
        {
            series: "2",
            index: 980,
            internal: true,
            audio: "condoms.mp3",
            annotation: "After Mark's plan to spend more time with Sophie fails he ends up in the ridiculous situation of having to buy condoms for Jeff:",
            line: "This is it. This is my lowest ever. Wish I told him to fuck off. Except then, I'd never be allowed back. OK, right. Fetherlite. Don't want him to enjoy it any more than is strictly necessary. Ultra Strong. Yeah, he won't feel a thing. But then, maybe he'll last longer and- oh Jesus! This is a minefield! Serve him right if I prick them all with pins and then... Sophie got pregnant, and therefore, he ended up getting married? Got to think through these plans more! I'll just go for these. Coloured. Least that'll make him look faintly ridiculous. Heh, I win! In the most minor way possible.",
        },
        {
            series: "2",
            index: 1073,
            internal: false,
            audio: "speech.mp3",
            annotation: "Mark's speech at Jez and Nancy's impromptu visa wedding:",
            line: "So, ladies and gentlemen. You'll forgive me, I haven't prepared a proper speech, but then perhaps that's appropriate, since this isn't a proper wedding. Or so the cynics may say. But I say to those cynics, listen, cynics, this is the modern world, and just because it's new and strange and unnerving doesn't mean it's not brilliant. In Ancient Rome, they had Cupid. In modern days, it's the Home Office. Love is blind. That's not a joke about David Blunkett. No, seriously, I would never make that joke.",
        },
    ];
}
export default SentenceAnnotations;