class CompletionSuggester {

}


class CompletionSuggesterTest {
    public test01(): void {
        const suggester = new CompletionSuggester();
        checkSuggestions(suggester, "<tag /><{|}");
        checkSuggestions(suggester, "<tag><{|}");
        checkSuggestions(suggester, "<input {|} />");
        checkSuggestions(suggester, "<{|} />");
        checkSuggestions(suggester, "<in{|} />");
        checkSuggestions(suggester, "<i{|}n />");
        checkSuggestions(suggester, "<i{|}n />");
        checkSuggestions(suggester, "<i{|}n />");
        checkSuggestions(suggester, "<input value='{|}' />");
        checkSuggestions(suggester, "<input value='Root/{|}' />");
        checkSuggestions(suggester, "<input value='Root/Va{|}' />");
        checkSuggestions(suggester, "<input type='{|}' />");
    }

    public test01(): void {
        const suggester = new CompletionSuggester();
        checkSuggestions(suggester, "<tag /><{|}");
        checkSuggestions(suggester, "<tag><{|}");
        checkSuggestions(suggester, "<input {|} />");
        checkSuggestions(suggester, "<{|} />");
        checkSuggestions(suggester, "<in{|} />");
        checkSuggestions(suggester, "<i{|}n />");
        checkSuggestions(suggester, "<i{|}n />");
        checkSuggestions(suggester, "<i{|}n />");
        checkSuggestions(suggester, "<input value='{|}' />");
        checkSuggestions(suggester, "<input value='Root/{|}' />");
        checkSuggestions(suggester, "<input value='Root/Va{|}' />");
        checkSuggestions(suggester, "<input type='{|}' />");
    }
}
