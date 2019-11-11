using Sync.Core;
using Sync.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sync.Client.Data
{
    public class KeyboardService
    {
        public static KeyboardModel CurrentKeyboard { get; set; }

        public static async Task<List<KeyboardModel>> GetAvailableKeyboardsAsync()
        {
            return await KeyboardUtilities.GetAvailableKeyboardsAsync();
        }
    }
}
