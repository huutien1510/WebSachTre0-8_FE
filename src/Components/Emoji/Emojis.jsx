import React from "react";
import PropTypes from "prop-types";
import { EmojisContainer, EmojiPickerContainer } from "./EmojisContainer.jsx";

const Emojis = ({ pickEmoji }) => {
    return (
        <EmojisContainer>
            {
                <EmojiPickerContainer onEmojiClick={pickEmoji} />
            }
        </EmojisContainer>
    )
}

Emojis.propTypes = {
    pickEmoji: PropTypes.func
}

export default Emojis