using Sync.Core.Models;
using System;

namespace Sync.Client.Models
{
    public class KeyboardItem
    {
        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the icon.
        /// </summary>
        public string Icon { get; set; }

        /// <summary>
        /// Navigate to this slug when selected.
        /// </summary>
        public string Slug { get; set; }

        /// <summary>
        /// Gets or sets the choice action.
        /// </summary>
        public Action<KeyboardItem> ChoiceAction { get; set; }

        /// <summary>
        /// Gets or sets the keyboard model.
        /// </summary>
        /// <value>
        /// The keyboard model.
        /// </value>
        public KeyboardModel KeyboardModel { get; set; }
    }
}
