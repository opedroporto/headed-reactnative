
renderComment = (obj) => {
    console.log(obj.item.messageContent)
    return (
        <Text style={styles.comment}>{ obj.item.messageContent }</Text>
    )
}
<FlatList
    renderItem={this.renderComment}
    keyExtractor={(item, index) => item + index}
    data={this.state.company.comments}
/>