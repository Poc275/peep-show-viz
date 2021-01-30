const SentenceAnnotations = function() {

    this.sentenceAnnotations = [
        // index 0 = average sentence length annotations
        // index 1 = internal vs external ratio annotations
        // index 2 = top noun annotations
        [
            "So for example, Mark's average sentence length was 6 words during the first episode and likewise for Jez.",
            "We see for the very first episode Mark nearly had a 50/50 split internal vs external but this tapered off during the series. In contrast Jez started with very few internal lines, but this increased as the series progressed.",
            "Cancer is mentioned a lot during episode 1 as an argument ensues over the doctor's name for Toni's sister. You can see which episode Johnson makes his grand first appearance. In the final episode we see a lot of soul searching going on as Jez contemplates his own existence after Uncle Ray passes away."
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
            index: 143,
            audio: "jez-interview.mp3",
            annotation: "This line is during Jeremy's interview at JLB where he tries to come across as an unemployable freak so as \"not to accidentally get the bugger\":",
            sentence: "Right you are. I might wobble a bit because I'm still a bit pissed from last night you see, and I don't want to get your hopes up too much 'cause I have to say, I'm only really here because, you know...",
        },
        {
            series: "1",
            index: 398,
            audio: "enya.mp3",
            annotation: "Noticeable are the short sentences spoken by Jez in episode 6. This is because of his now famous \"Enya\" monologue during Uncle Ray's funeral:",
            sentence: "Look, what I'm trying to say is that, if I was dying, and I decided that even though I'd never particularly been into, say uh... Enya before, but that now I really, really was into Enya and that in fact I thought Enya was great, and that Enya died for our sins and I wanted an Enya-themed funeral with pictures of Enya and lots and lots of mentions of... Enya, then I think it would be a bit bloody rich for my sister to ban all mention of Enya from my funeral.",
        },
    ];
}
export default SentenceAnnotations;