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
        [""],
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
            audio: "enya.mp3",
            annotation: "Same goes for Jez in episode 6. This is because of his \"Enya\" speech during Uncle Ray's funeral:",
            line: "Look, what I'm trying to say is that, if I was dying, and I decided that even though I'd never particularly been into, say uh... Enya before, but that now I really, really was into Enya and that in fact I thought Enya was great, and that Enya died for our sins and I wanted an Enya-themed funeral with pictures of Enya and lots and lots of mentions of... Enya, then I think it would be a bit bloody rich for my sister to ban all mention of Enya from my funeral.",
        },
    ];
}
export default SentenceAnnotations;